import { HomeAssistantInstance } from "./homeAssistantInstance";

export class HomeAssistantInstancePublicServices {
  #instance: HomeAssistantInstance;

  constructor(instance: HomeAssistantInstance){
    this.#instance = instance;
  }

  switch = {
    turn_on: async (entityId: string) => await this.#instance.callService("switch", "turn_on", { entity_id: entityId }),
    turn_off: async (entityId: string) => await this.#instance.callService("switch", "turn_off", { entity_id: entityId }),
    toggle: async (entityId: string) => await this.#instance.callService("switch", "toggle", { entity_id: entityId }),
  }
  vaccum = {
    start: async (entityId: string) => await this.#instance.callService("vaccum", "start", { entity_id: entityId }),
  }
  input_boolean =  {
    turn_on: async (entityId: string) => await this.#instance.callService("input_boolean", "turn_on", { entity_id: entityId })
  }
  notify = async (entityId: string, data: any) => await this.#instance.callService("notify", entityId, data);
  call = async (domain: string, service: string, data?: any) => await this.#instance.callService(domain, service, data);
}
