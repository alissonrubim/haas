import { CalendarPlatformEventArgs, EventPlatformEventArgs, MqttPlatformEventArgs, StatePlatformEventArgs, SunPlatformEventArgs, TimePatternPlatformEventArgs, TimePlatformEventArgs } from "../haam/platforms";

export type SubscriptionArgs =
  CalendarPlatformEventArgs |
  EventPlatformEventArgs |
  MqttPlatformEventArgs |
  StatePlatformEventArgs |
  SunPlatformEventArgs |
  TimePatternPlatformEventArgs | 
  TimePlatformEventArgs