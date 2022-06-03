import HomeAssistantWebSocketGateway from '../gateways/homeAssistantWebSocketGateway';
import { HomeAssistantEntityState, HomeAssistantStateChangeMessage, HomeAssistantEntityMessage, HomeAssistantTriggerMessage } from '../gateways/presentations';
import { HomeAssistantInstancePublic } from './homeAssistantInstancePublic';

interface EventSubscription {
  id: string,
  entityId: string,
  handler: (entityId: string, newState: HomeAssistantEntityState, oldState: HomeAssistantEntityState) => Promise<void>
}

// interface TriggerSubscription {
//   id: string
// }

export class HomeAssistantInstance {
  #gateway: HomeAssistantWebSocketGateway;
  #registeredEventSubscriptions: EventSubscription[] = [];

  constructor(host: string, port: number, accessToken: string) {
    this.#gateway = new HomeAssistantWebSocketGateway(host, port, accessToken); 
  }

  // When a event is fired, it will search the subscriptions that match the entity
  #handleStateChangeEvent(evt: HomeAssistantStateChangeMessage){
    this.#registeredEventSubscriptions.filter((x) => x.entityId === evt.data.entity_id).forEach(async (x) => {
      await x.handler(x.entityId, evt.data.new_state, evt.data.old_state)
    })
  }

  #handleTriggerEvent(evt: HomeAssistantTriggerMessage){
    console.info(evt)
  }

  public async connect(){
    await this.#gateway.connect();

    this.#gateway.onMessage((evt: HomeAssistantEntityMessage) => {
      if(evt.type == "event"){
        if(evt.event && evt.event.event_type === "state_changed"){
          this.#handleStateChangeEvent(evt.event as HomeAssistantStateChangeMessage)
        }
        else if(evt.event.variables && evt.event.variables.trigger){
          this.#handleTriggerEvent(evt.event as HomeAssistantTriggerMessage)
        }
      }
    })
  }

  // This function will register a subscription on the list
  public subscribeToStateChange(entityId: string, handler: EventSubscription["handler"]): string {
    const subscriptionId = `${entityId}_${new Date().getTime()}`;
    this.#registeredEventSubscriptions.push({
      id: subscriptionId,
      entityId,
      handler
    })
    return subscriptionId;
  }

  // This function will remove a event subscription from the list
  public unsubscribeToStateChange(subscriptionId: string){
    const subscription = this.#registeredEventSubscriptions.find((x) => x.id === subscriptionId);
    if(subscription)
      this.#registeredEventSubscriptions.splice(this.#registeredEventSubscriptions.indexOf(subscription), 1);
  }

  public getExposedInstance(): HomeAssistantInstancePublic {
    return new HomeAssistantInstancePublic(this)
  }

  public async getEntity(entityId: string): Promise<HomeAssistantEntityState| undefined>{
    const states = await this.#gateway.getStates();
    return Promise.resolve(states?.find((x) => x.entity_id === entityId))
  }

  public async callService(domain: string, service: string, data?: any) {
    return await this.#gateway.callService(domain, service, data)
  }

  public async subscribeToTrigger(trigger: {}, handler: () => void){
    return await this.#gateway.subscribeToTrigger(trigger); 
  }
}