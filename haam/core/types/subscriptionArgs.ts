import { 
  CalendarPlatformEventArgs, 
  EventPlatformEventArgs, 
  MqttPlatformEventArgs, 
  StatePlatformEventArgs, 
  SunPlatformEventArgs, 
  TimePatternPlatformEventArgs,
  TimePlatformEventArgs 
} from "../processors/platforms";

export type SubscriptionArgs =
  CalendarPlatformEventArgs |
  EventPlatformEventArgs |
  MqttPlatformEventArgs |
  StatePlatformEventArgs |
  SunPlatformEventArgs |
  TimePatternPlatformEventArgs | 
  TimePlatformEventArgs