import { processSubscriptionsByTrigger } from './processors/processSubscriptionsByTrigger';
import { 
  HomeAssistantInstance, 
} from './services/homeAssistantInstance';
import { HomeAssistantInstancePublic } from './services/homeAssistantInstancePublic'
import { 
  Subscription, SubscriptionArgs,
} from './types';

interface RegisteredSubscription extends Subscription {
  _isProcessed: boolean,
  _eventsControll: {
    triggersSubscriptions?: Array<{
      id: string
    }>
  }
}

export class HaamCore {
  #subscriptions: RegisteredSubscription[] = [];
  #homeAssistantInstance: HomeAssistantInstance;
  instance: HomeAssistantInstancePublic;

  private async fireSubscription(sub: Subscription, args: SubscriptionArgs){
    try{
      if(sub.enabled === true && (sub.condition ? await sub.condition(args) : true)){
        console.info(new Date(), `[${sub.id}-${sub.name}]: Subscription action started.`)
        await sub.action(args)
        console.info(new Date(), `[${sub.id}-${sub.name}]: Subscription action done.`)
      }
    }catch(e){
      console.error("An error ocurred:", e)
    }
  } 
  
  private async processSubscription(sub: RegisteredSubscription){
    if(sub._isProcessed)
      throw new Error(`Subscriotion ${sub.id} already processed!`)
    
    sub._eventsControll.triggersSubscriptions = (await processSubscriptionsByTrigger(this.#homeAssistantInstance, sub, this.fireSubscription)).map((x) => ({ id: x }));
    sub._isProcessed = true;
  }

  private async processSubscriptions(){
    for(const sub of this.#subscriptions.filter((x) => !x._isProcessed))
      await this.processSubscription(sub);
  }

  constructor(host: string, port: number, accessToken: string) {
    this.#homeAssistantInstance = new HomeAssistantInstance(host, port, accessToken);
    this.instance = this.#homeAssistantInstance.getExposedInstance();
  }

  public async process(sub: Subscription){
    const subscription = this.#subscriptions.find((x) => x.id === sub.id);
    if(!subscription)
      throw new Error(`Unable to process subscriotion ${sub.id}. It was not found!`)
    
    await this.processSubscription(subscription);
  }

  public subscribe(sub: Subscription){
    const subscription = this.#subscriptions.find((x) => x.id === sub.id);
    if(!subscription){
      this.#subscriptions.push({
        ...sub,
        _isProcessed: false,
        _eventsControll: {
          triggersSubscriptions: []
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
        subscription._eventsControll.triggersSubscriptions?.forEach((triggersSubscription) => {
          this.#homeAssistantInstance.unsubscribeToTrigger(triggersSubscription.id)
        })
      }
    }
  }

  // public fireSubscriptionById(id: string){
  //   const registeredSubscription = this.#subscriptions.find((x) => x.id === id && x._isProcessed); 
  //   if(registeredSubscription)
  //     this.fireSubscription(registeredSubscription, {})
  //   else
  //     throw new Error(`Subscription ${id} not found!`);
  // }

  public async start(){
    console.info("Starting Haas...");

    console.info("\n\nConnectiong to Home Assistant...");
    await this.#homeAssistantInstance.connect();
    console.info("Conneceted successfully to Home Assistant!!");

    console.info(`\n\nRegistering subscriptions....`)
    await this.processSubscriptions();
    console.info(`${this.#subscriptions.filter((x) => x._isProcessed === true).length} subscriptions registered successfully!`);

    console.info("\n\nHome Assistant Automation Manager has successfully started at", new Date(), "\n\n");
  }
}