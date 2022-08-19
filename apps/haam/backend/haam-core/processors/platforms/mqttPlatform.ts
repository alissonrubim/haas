import { HomeAssistantMessage } from "../../gateways/presentations"

export interface MqttPlatform {
  platform: "mqtt",
  topic: string
}

export function mqttPlatformResolver(config: MqttPlatform){
  return {
    platform: "mqtt",
    topic: config.topic
  }
}

export interface MqttPlatformEventArgs {
  platform: "mqtt",
  data: {
    id: string,
    idx: string,
    platform: string,
    //MISSING....
  }
}