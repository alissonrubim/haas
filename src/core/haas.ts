import * as cron from 'node-cron';
import { 
  HomeAssistantInstance, 
} from './services/homeAssistantInstance';
import { HomeAssistantInstancePublic } from './services/homeAssistantInstancePublic'
import { 
  ByScheduleConfig,
  ByScheduleConfigCronField,
  DateTimeEntity,
  Subscription, SubscriptionArgs, SubscriptionConfig,
} from './types';

interface RegisteredSubscription {
  id: string,
  subscription: Subscription,
  controll: {
    cronScheduledTask?: cron.ScheduledTask,
    eventSubscriptionId?: string,
  }
}

export class Haas {
  #subscriptions: Subscription[] = [];
  #registeredSubscriptions: RegisteredSubscription[] = [];
  #homeAssistantInstance: HomeAssistantInstance;
  instance: HomeAssistantInstancePublic;

  async #triggerSubscription(subscriotion: Subscription, args: SubscriptionArgs){
    try{
      if(subscriotion.condition ? await subscriotion.condition(args) : true){
        console.info(new Date(), `[${subscriotion.id}-${subscriotion.name}]: Subscription handler trigged.`)
        await subscriotion.handler(args)
        console.info(new Date(), `[${subscriotion.id}-${subscriotion.name}]: Subscription handler done.`)
      }
    }catch(e){
      console.error("An error ocurred:", e)
    }
  }


  async #processSubscriptionsBySchedule(sub: Subscription){
    const registerCronExpression = (expression: string) => {
      const cronScheduledTask = cron.schedule(expression, async () => {
        const args = {
          scheduleArgs: {}
        };

        await this.#triggerSubscription(sub, args)
      })

      this.#registeredSubscriptions.push({
        id: sub.id,
        subscription: sub,
        controll: {
          cronScheduledTask
        }
      })
    }

    const processSchedule = async (schedule: ByScheduleConfig) => {
      if(!schedule.expression && !schedule.cron)
        throw new Error("When configuring a subscription, you must define `cron` or `expression` property.")

      if(schedule.expression)
        registerCronExpression(schedule.expression)

      if(schedule.cron){
        const getExpression = async (property: "second" | "hour" | "minute" | "day"): Promise<string | number> => {
          const returnPieceFromDate = (date: Date | undefined, piece: DateTimeEntity["entity"]): number | string => {
            if(date){
              if(piece === "year")
                return date?.getUTCFullYear()
              if(piece === "month")
                return date?.getUTCMonth()
              if(piece === "day")
                return date?.getUTCDay()
              if(piece === "hour")
                return date?.getUTCHours()
              if(piece === "minute")
                return date?.getUTCMinutes()
              if(piece === "second")
                return date?.getUTCMinutes()
            }
            return "*";
          }

          const processCronProperty = async (conProperty: ByScheduleConfigCronField | undefined): Promise<string | number> => {
            if(!schedule.cron?.[property])
              return "*";  

            if(typeof conProperty === 'object'){
              const dateTimeEntity = conProperty as DateTimeEntity;
              const date = await this.instance.states.getDateTime(dateTimeEntity.entity, "HH:mm:ss");

              // this.#homeAssistantInstance.subscribeToStateChange(dateTimeEntity.entity, async (entityId, newState, oldState) => {
              //   this.unsubscribe(sub.id);
              //   this.subscribe(sub);
              //   this.#processSubscription(sub);
              // });

              return returnPieceFromDate(date, dateTimeEntity.piece ?? property);
            }
  
            return conProperty as string;
          }

          // If the cron job property is an Array, it will proccess each one and join with `,` at the end
          if(Array.isArray(schedule.cron?.[property])){
            const cronPropsValues: Array<string | number> = []
            for(const cronProperty of (schedule.cron?.[property] as Array<any>)){
              cronPropsValues.push(await processCronProperty(cronProperty))
            }
            return Promise.resolve(cronPropsValues.join(","));
          }
          else{
            return await processCronProperty(schedule.cron?.[property]);
          }
        }
          
        const weekDays = schedule.cron.weekDays ? Object.entries(schedule.cron.weekDays).map(([key, value]) => value ? key.slice(0, 3) : "").filter((x) => x).join(",") : null;
        const month = schedule.cron.month ? Object.entries(schedule.cron.month).map(([key, value]) => value ? key.slice(0, 3) : "").filter((x) => x).join(",") : null;
        const expression = `${await getExpression("minute")} ${await getExpression("hour")} ${await getExpression("day")} ${month ?? "*"} ${weekDays ?? "*"}`;
        registerCronExpression(expression);
      }
    }

    let schedules: ByScheduleConfig[] = []
    if(!Array.isArray(sub.config.bySchedule))
      schedules.push(sub.config.bySchedule as ByScheduleConfig)
    else
      schedules = sub.config.bySchedule as ByScheduleConfig[];

    for(const schedule of schedules)
      await processSchedule(schedule)
  }

  #processSubscriptionsByEntityEvent(sub: Subscription){
    if(sub.config.byEntityEvent){
      const eventSubscriptionId = this.#homeAssistantInstance.subscribeToStateChange(sub.config.byEntityEvent?.entityId, async (entityId, newState, oldState) => {
        const args = {
          entityEventArgs: {
            entityId,
            newState,
            oldState
          }
        }

        await this.#triggerSubscription(sub, args)
      });

      this.#registeredSubscriptions.push({
        id: sub.id,
        subscription: sub,
        controll: {
          eventSubscriptionId
        }
      })
      
    }
  }

  async #processSubscriptions(){
    for(const sub of this.#subscriptions)
      await this.#processSubscription(sub);
  }

  async #processSubscription(sub: Subscription){
    if(sub.config.bySchedule){
      await this.#processSubscriptionsBySchedule(sub)
    }
    if(sub.config.byEntityEvent){
      this.#processSubscriptionsByEntityEvent(sub)
    }
  }

  constructor(host: string, port: number, accessToken: string) {
    this.#homeAssistantInstance = new HomeAssistantInstance(host, port, accessToken);
    this.instance = this.#homeAssistantInstance.getExposedInstance();
  }

  public subscribe(subscription: Subscription){
    this.#subscriptions.push(subscription);
  }

  public unsubscribe(subscriotionId: string){
    const subscription = this.#subscriptions.find((x) => x.id === subscriotionId);
    if(subscription){
      this.#subscriptions.splice(this.#subscriptions.indexOf(subscription), 1);

      const removeRegisteredSubscriptions: RegisteredSubscription[] = [];
      this.#registeredSubscriptions.filter((x) => x.id === subscriotionId).forEach((s) => {
        if(s.controll.cronScheduledTask){
          s.controll.cronScheduledTask.stop();
          s.controll.cronScheduledTask = undefined;
        }
        if(s.controll.eventSubscriptionId){
          this.#homeAssistantInstance.unsubscribeToStateChange(s.controll.eventSubscriptionId)
        }

        removeRegisteredSubscriptions.push(s)
      });

      removeRegisteredSubscriptions.forEach((s) => {
        this.#registeredSubscriptions.splice(this.#registeredSubscriptions.indexOf(s), 1);
      })
    }
  }

  public triggerSubscriptionById(id: string){
    const registeredSubscription = this.#registeredSubscriptions.find((x) => x.subscription.id === id); 
    if(registeredSubscription)
      this.#triggerSubscription(registeredSubscription.subscription, {})
    else
      throw new Error(`Subscription ${id} not found!`);
  }

  public async start(){
    console.info("Starting Haas...");

    console.info("\n\nConnectiong to Home Assistant...");
    await this.#homeAssistantInstance.connect();
    console.info("Conneceted successfully to Home Assistant!!");

    console.info(`\n\nRegistering subscriptions....`)
    await this.#processSubscriptions();
    console.info(`${this.#subscriptions.length} subscriptions registered successfully!`);

    console.info("\n\nHaas successfully started at", new Date(), "\n\n")
  }
}