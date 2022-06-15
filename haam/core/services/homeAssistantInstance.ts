import HomeAssistantWebSocketGateway from '../gateways/homeAssistantWebSocketGateway';
import { HomeAssistantEntityState, HomeAssistantStateChangeMessage, HomeAssistantMessage, HomeAssistantTriggerMessage } from '../gateways/presentations';
import { HomeAssistantInstancePublic } from './homeAssistantInstancePublic';
import { StateChangeSubscription } from './types';
import { TriggerSubscription } from './types/triggerSubscription';

export class HomeAssistantInstance {
  #gateway: HomeAssistantWebSocketGateway;
  #registeredStateChangeSubscriptions: StateChangeSubscription[] = [];
  #registeredTriggers: TriggerSubscription[] = [];

  constructor(host: string, port: number, accessToken: string) {
    this.#gateway = new HomeAssistantWebSocketGateway(host, port, accessToken); 
  }

  #handleStateChangeEvent(evt: HomeAssistantStateChangeMessage){
    this.#registeredStateChangeSubscriptions.filter((x) => x.entityId === evt.event.data.entity_id).forEach(async (x) => {
      await x.handler(x.entityId, evt.event.data.new_state, evt.event.data.old_state)
    })
  }

  #handleTriggerEvent(evt: HomeAssistantTriggerMessage){
    this.#registeredTriggers.filter((x) => x.id === evt.id).forEach(async (x) => {
      await x.handler(evt.event.variables.trigger)
    })
  }

  #handleMessages(message: HomeAssistantMessage){
    // State_Changed
    if(message.type == "event" && message.event && message.event.event_type === "state_changed")
      this.#handleStateChangeEvent(message as HomeAssistantStateChangeMessage)
    else
    // Trigger
    if(message.type == "event" && message.event.variables && message.event.variables.trigger)
      this.#handleTriggerEvent(message as HomeAssistantTriggerMessage)
  }

  public async connect(){
    await this.#gateway.connect();
    this.#gateway.onMessage((evt: HomeAssistantMessage) => {
      this.#handleMessages(evt)
    })
  }

  public subscribeToStateChange(entityId: string, handler: StateChangeSubscription["handler"]): string {
    const subscriptionId = `${entityId}_${new Date().getTime()}`;
    this.#registeredStateChangeSubscriptions.push({
      id: subscriptionId,
      entityId,
      handler
    })
    return subscriptionId;
  }

  public unsubscribeToStateChange(subscriptionId: string){
    const subscription = this.#registeredStateChangeSubscriptions.find((x) => x.id === subscriptionId);
    if(subscription)
      this.#registeredStateChangeSubscriptions.splice(this.#registeredStateChangeSubscriptions.indexOf(subscription), 1);
  }

  public async subscribeToTrigger(trigger: any, handler: (evt: any) => Promise<void>): Promise<string>{
    const subscriptionId = await this.#gateway.subscribeToTrigger(trigger);
    this.#registeredTriggers.push({
      id: subscriptionId,
      handler: handler
    });
    return Promise.resolve(subscriptionId)
  }

  public unsubscribeToTrigger(triggerId: string){
    const subscription = this.#registeredTriggers.find((x) => x.id === triggerId);
    if(subscription)
      this.#registeredTriggers.splice(this.#registeredTriggers.indexOf(subscription), 1);
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
}