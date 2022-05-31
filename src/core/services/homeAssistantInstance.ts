import HomeAssistantWebSocketGateway from '../gateways/homeAssistantWebSocketGateway';
import { HomeAssistantEntityStateResponse } from '../gateways/presentations/homeAssistantEntityState.response';
import { HomeAssistantStateChangeResponse } from '../gateways/presentations/homeAssistantStateChange.response';
import { HomeAssistantInstancePublic } from './homeAssistantInstancePublic'

interface EventSubscription {
  id: string,
  entityId: string,
  handler: (entityId: string, newState: HomeAssistantEntityStateResponse, oldState: HomeAssistantEntityStateResponse) => Promise<void>
}

export class HomeAssistantInstance {
  #gateway: HomeAssistantWebSocketGateway;
  #registeredEventSubscriptions: EventSubscription[] = [];

  constructor(host: string, port: number, accessToken: string) {
    this.#gateway = new HomeAssistantWebSocketGateway(host, port, accessToken); 
  }

  // When a event is fired, it will search the subscriptions that match the entity
  #handleStateChange(evt: HomeAssistantStateChangeResponse){
    this.#registeredEventSubscriptions.filter((x) => x.entityId === evt.data.entity_id).forEach(async (x) => {
      await x.handler(x.entityId, evt.data.new_state, evt.data.old_state)
    })
  }

  public async connect(){
    await this.#gateway.connect();

    // This will handle all events and it will foward to the respective subscription
    this.#gateway.handleStateChange((evt: HomeAssistantStateChangeResponse) => {
      this.#handleStateChange(evt)
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

  public async getEntity(entityId: string): Promise<HomeAssistantEntityStateResponse | undefined>{
    const states = await this.#gateway.getStates();
    return Promise.resolve(states?.find((x) => x.entity_id === entityId))
  }

  public async callService(domain: string, service: string, data?: any) {
    return await this.#gateway.callService(domain, service, data)
  }
}