import * as cron from 'node-cron';
import { 
  HomeAssistantInstance, 
} from './services/homeAssistantInstance';
import { HomeAssistantInstancePublic } from './services/homeAssistantInstancePublic'
import { 
  ByScheduleConfig,
  ByScheduleConfigCronField,
  DateTimeEntity,
  Subscription, SubscriptionArgs,
} from './types';

interface RegisteredEventSubscription {
  entityId: string,
  subscriptionEventId: string
}

interface RegisteredScheduleSubscription {
  task: cron.ScheduledTask,
  expression: string
}

interface RegisteredSubscription extends Subscription {
  _isProcessed: boolean,
  _eventsControll: {
    scheduleSubscriptions?: RegisteredScheduleSubscription[],
    eventSubscription?: RegisteredEventSubscription[]
  }
}

export class HaamCore {
  #subscriptions: RegisteredSubscription[] = [];
  #homeAssistantInstance: HomeAssistantInstance;
  instance: HomeAssistantInstancePublic;

  // Fire the subscription handler
  async #fireSubscription(sub: Subscription, args: SubscriptionArgs){
    try{
      if(sub.condition ? await sub.condition(args) : true){
        console.info(new Date(), `[${sub.id}-${sub.name}]: Subscription handler trigged.`)
        await sub.handler(args)
        console.info(new Date(), `[${sub.id}-${sub.name}]: Subscription handler done.`)
      }
    }catch(e){
      console.error("An error ocurred:", e)
    }
  }

  async #processSubscriptionsBySchedule(sub: Subscription): Promise<RegisteredScheduleSubscription[]> {
    const registerCronExpression = (expression: string): cron.ScheduledTask => {
      return cron.schedule(expression, async () => {
        const args = {
          scheduleArgs: {}
        };

        await this.#fireSubscription(sub, args)
      });
    }

    const processSchedule = async (schedule: ByScheduleConfig): Promise<RegisteredScheduleSubscription | undefined> => {
      if(!schedule.expression && !schedule.cron)
        throw new Error("When configuring a subscription, you must define `cron` or `expression` property.")

      if(schedule.expression)
        return {
          expression: schedule.expression,
          task: registerCronExpression(schedule.expression)
        }

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

            // if(typeof conProperty === 'object'){
            //   const dateTimeEntity = conProperty as DateTimeEntity;
            //   const date = await this.instance.states.getDateTime(dateTimeEntity.entity, "HH:mm:ss");

            //   // const registeredSub = this.#subscriptions.find((x) => x.id === sub.id);
            //   // if(!registeredSub?._eventsControll.eventSubscription?.find((x) => x.entityId == dateTimeEntity.entity)){
            //   //   const subscriptionEventId = this.#homeAssistantInstance.subscribeToStateChange(dateTimeEntity.entity, async (entityId, newState, oldState) => {
            //   //     this.unsubscribe(sub.id);
            //   //     this.subscribe(sub);
            //   //     await this.process(sub);
            //   //     console.info(this.#subscriptions.find((x) => x.id === sub.id)?._eventsControll.scheduleSubscriptions)
            //   //   });

            //   //   registeredSub?._eventsControll.eventSubscription?.push({
            //   //     entityId: dateTimeEntity.entity,
            //   //     subscriptionEventId
            //   //   })
            //   // }

            //   return returnPieceFromDate(date, dateTimeEntity.piece ?? property);
            // }
  
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

        return {
          expression: expression,
          task: registerCronExpression(expression)
        }
      }

      return undefined;
    }

    let schedules: ByScheduleConfig[] = []
    if(!Array.isArray(sub.config.bySchedule))
      schedules.push(sub.config.bySchedule as ByScheduleConfig)
    else
      schedules = sub.config.bySchedule as ByScheduleConfig[];

    const schedulesTasks: RegisteredScheduleSubscription[] = [];
    for(const schedule of schedules){
      const scheduleTask = await processSchedule(schedule)
      if(scheduleTask){
        schedulesTasks.push(scheduleTask);
      }
    }

    return Promise.resolve(schedulesTasks);
  }

  #processSubscriptionsByEntityEvent(sub: Subscription): RegisteredEventSubscription {
    const subscriptionEventId = this.#homeAssistantInstance.subscribeToStateChange(sub.config.byEntityEvent?.entityId ?? '', async (entityId, newState, oldState) => {
      const args = {
        entityEventArgs: {
          entityId,
          newState,
          oldState
        }
      }

      await this.#fireSubscription(sub, args)
    });

    return {
      entityId: sub.config.byEntityEvent?.entityId ?? '',
      subscriptionEventId,
    }
  }

  async #processSubscriptions(){
    for(const sub of this.#subscriptions.filter((x) => !x._isProcessed))
      await this.#processSubscription(sub);
  }

  async #processSubscription(sub: RegisteredSubscription){
    if(sub._isProcessed)
      throw new Error(`Subscriotion ${sub.id} already processed!`)

    if(sub.config.bySchedule)
      sub._eventsControll.scheduleSubscriptions = await this.#processSubscriptionsBySchedule(sub);

    if(sub.config.byEntityEvent)
      sub._eventsControll.eventSubscription = [this.#processSubscriptionsByEntityEvent(sub)]

    sub._isProcessed = true;
  }

  constructor(host: string, port: number, accessToken: string) {
    this.#homeAssistantInstance = new HomeAssistantInstance(host, port, accessToken);
    this.instance = this.#homeAssistantInstance.getExposedInstance();
  }

  public async process(sub: Subscription){
    const subscription = this.#subscriptions.find((x) => x.id === sub.id);
    if(!subscription)
      throw new Error(`Subscription ${sub.id} not found!`)
    
    await this.#processSubscription(subscription);
  }

  public subscribe(sub: Subscription){
    const subscription = this.#subscriptions.find((x) => x.id === sub.id);
    if(!subscription){
      this.#subscriptions.push({
        ...sub,
        _isProcessed: false,
        _eventsControll: {
          eventSubscription: [],
          scheduleSubscriptions: []
        }
      });
    }else{
      throw new Error(`Subscription id ${sub.id} already in use!`)
    }
  }

  public unsubscribe(subId: string){
    const subscription = this.#subscriptions.find((x) => x.id === subId);
    if(subscription){
      this.#subscriptions.splice(this.#subscriptions.indexOf(subscription), 1);

      if(subscription._isProcessed){
        subscription._eventsControll.scheduleSubscriptions?.forEach((scheduleSub) => {
          scheduleSub.task.stop();
        })

        subscription._eventsControll.eventSubscription?.forEach((subEvent) => {
          this.#homeAssistantInstance.unsubscribeToStateChange(subEvent.entityId)
        })
      }
    }
  }

  // Run a subscription base on the subscriptionId
  public fireSubscriptionById(id: string){
    const registeredSubscription = this.#subscriptions.find((x) => x.id === id && x._isProcessed); 
    if(registeredSubscription)
      this.#fireSubscription(registeredSubscription, {})
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
    console.info(`${this.#subscriptions.filter((x) => x._isProcessed === true).length} subscriptions registered successfully!`);

    console.info("\n\nHaas successfully started at", new Date(), "\n\n")

    // this.#homeAssistantInstance.subscribeToTrigger({
    //   platform: "time",
    //   at: "input_datetime.trash_reminder_schedule_time"
    // }, () => {
    //   console.info("opa")
    // })
  }
}