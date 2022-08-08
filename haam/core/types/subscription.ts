import { TriggerConfig } from "../processors/processSubscriptionsByTrigger"
import { SubscriptionArgs } from "./subscriptionArgs"

export interface Subscription {
  enabled: boolean,
  id: string,
  name: string,
  trigger: TriggerConfig | Array<TriggerConfig>,
  condition?: (args: SubscriptionArgs) => Promise<boolean> | boolean,
  action: (args: SubscriptionArgs) => Promise<void>
}