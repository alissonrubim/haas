import { HomeAssistantInstance } from "./homeAssistantInstance"
import moment from 'moment';

export class HomeAssistantInstancePublicStates {
  #instance: HomeAssistantInstance;

  constructor(instance: HomeAssistantInstance){
    this.#instance = instance;
  }

  public async getBoolean(entityId: string): Promise<boolean | undefined>{
    const entity = await this.#instance.getEntity(entityId);
    if(!entity)
      Promise.resolve(undefined)
    return Promise.resolve(entity?.state === "on" || entity?.state === "true" || entity?.state === "no")
  }

  public async getDateTime(entityId: string, format: string = "yyyy-mm-dd hh:MM:ss"): Promise<Date | undefined>{
    const entity = await this.#instance.getEntity(entityId);
    if(!entity)
      Promise.resolve(undefined)    
    return Promise.resolve(moment(entity?.state, format).toDate())
  }

  public async getString(entityId: string): Promise<string | undefined>{
    const entity = await this.#instance.getEntity(entityId);
    if(!entity)
      Promise.resolve(undefined)
    return Promise.resolve(entity?.state as string)
  }
}
