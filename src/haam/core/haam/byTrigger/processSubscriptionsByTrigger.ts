import { HomeAssistantInstance } from "../../services/homeAssistantInstance";
import { Subscription, SubscriptionArgs } from "../../types";
import { 
  StatePlatform, 
  statePlatformResolver,
  SunPlatform, 
  sunPlatformResolver,
  TimePlatform,
  timePlatformResolver,
  CalendarPlatform,
  calendarPlatformResolver,
  MqttPlatform,
  mqttPlatformResolver,
  TimePatternPlatform,
  timePatternPlatformResolver,
  EventPlatform,
  eventPlatformResolver
} from "./platforms";

export type TriggerConfig = 
  StatePlatform | 
  SunPlatform | 
  TimePlatform | 
  CalendarPlatform | 
  MqttPlatform | 
  TimePatternPlatform | 
  EventPlatform


const resolvers = {
  time: timePlatformResolver,
  state: statePlatformResolver,
  sun: sunPlatformResolver,
  calendar: calendarPlatformResolver,
  mqtt: mqttPlatformResolver,
  time_pattern: timePatternPlatformResolver,
  event: eventPlatformResolver
}

export async function processSubscriptionsByTrigger(
  hai: HomeAssistantInstance, 
  sub: Subscription, 
  fireSubscriptionHandler: (sub: Subscription, args: SubscriptionArgs) => Promise<void>): Promise<string[]> {
  const triggers = Array.isArray(sub.trigger) ? sub.trigger : [sub.trigger];

  const getTriggerScope = (config: TriggerConfig): any => {
    return resolvers[config.platform](config as any)
  }

  const subscriptionIds: string[] = [];
  for(const trigger of triggers){
    if(trigger){
      const triggerScope = getTriggerScope(trigger);
      const subscriptionId = await hai.subscribeToTrigger(triggerScope, async (evt: any) => {
        const args = {
          triggerEventArgs: evt
        }
        await fireSubscriptionHandler(sub, args)
      })
      subscriptionIds.push(subscriptionId)
    }
  }

  return Promise.resolve(subscriptionIds)
}