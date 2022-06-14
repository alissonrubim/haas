export interface EventPlatform {
  platform: "event",
  eventType: string,
  eventData?: {}
}

export function eventPlatformResolver(config: EventPlatform){
  return {
    platform: "event",
    event_type: config.eventType,
    event_data: config.eventData
  }
}