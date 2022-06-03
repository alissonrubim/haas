import { HomeAssistantEntityStateResponse }  from '../gateways/presentations/homeAssistantEntityState.response';
import { HomeAssistantInstancePublicServices } from './homeAssistantInstancePublic.services';
import { HomeAssistantInstancePublicStates } from './homeAssistantInstancePublic.states';
import { HomeAssistantInstance } from './homeAssistantInstance';


export class HomeAssistantInstancePublic {
  #instance: HomeAssistantInstance;
  states: HomeAssistantInstancePublicStates;
  services: HomeAssistantInstancePublicServices;

  constructor(instance: HomeAssistantInstance){
    this.#instance = instance;
    this.states = new HomeAssistantInstancePublicStates(instance);
    this.services = new HomeAssistantInstancePublicServices(instance);
  }

  public async getEntity(entityId: string): Promise<HomeAssistantEntityStateResponse | undefined>{
    return this.#instance.getEntity(entityId)
  }
}