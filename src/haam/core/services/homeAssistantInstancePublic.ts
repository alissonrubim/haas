import { HomeAssistantEntityState }  from '../gateways/presentations';
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

  public async getEntity(entityId: string): Promise<HomeAssistantEntityState | undefined>{
    return this.#instance.getEntity(entityId)
  }
}