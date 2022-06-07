import { HomeAssistantInstance } from "./homeAssistantInstance";

export class HomeAssistantInstancePublicServices {
  #instance: HomeAssistantInstance;

  constructor(instance: HomeAssistantInstance){
    this.#instance = instance;
  }
  light = {
    turn_on: async (entityId: string, data?: any) => await this.#instance.callService("light", "turn_on", { entity_id: entityId, ...data }),
    turn_off: async (entityId: string) => await this.#instance.callService("light", "turn_off", { entity_id: entityId }),
    toggle: async (entityId: string) => await this.#instance.callService("light", "toggle", { entity_id: entityId }),
  }
  switch = {
    turn_on: async (entityId: string) => await this.#instance.callService("switch", "turn_on", { entity_id: entityId }),
    turn_off: async (entityId: string) => await this.#instance.callService("switch", "turn_off", { entity_id: entityId }),
    toggle: async (entityId: string) => await this.#instance.callService("switch", "toggle", { entity_id: entityId }),
  }
  fan = {
    turn_on: async (entityId: string) => await this.#instance.callService("fan", "turn_on", { entity_id: entityId }),
    turn_off: async (entityId: string) => await this.#instance.callService("fan", "turn_off", { entity_id: entityId }),
    toggle: async (entityId: string) => await this.#instance.callService("fan", "toggle", { entity_id: entityId }),
  }
  vaccum = {
    start: async (entityId: string) => await this.#instance.callService("vaccum", "start", { entity_id: entityId }),
  }
  input_boolean =  {
    turn_on: async (entityId: string) => await this.#instance.callService("input_boolean", "turn_on", { entity_id: entityId })
  }
  media_player = {
    set_volume: async (entityId: string, volume: number) => await this.#instance.callService("media_player", "volume_set", { entity_id: entityId, volume_level: `${volume}` }),
    media_play_pause: async (entityId: string) => await this.#instance.callService("media_player", "media_play_pause", { entity_id: entityId })
  }
  input_select = {
    select_option: async (entityId: string, option: string) => await this.#instance.callService("input_select", "select_option", { entity_id: entityId, option })
  }
  notify = async (entityId: string, data: any) => await this.#instance.callService("notify", entityId, data);
  tts = async (entityId: string, message: string) => await this.#instance.callService("tts", "cloud_say", { entity_id: entityId, message: message })
  call = async (domain: string, service: string, data?: any) => await this.#instance.callService(domain, service, data);
}
