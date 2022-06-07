import { SubscriptionArgs } from './subscriptionArgs';
import { SubscriptionConfig } from './subscriptionConfig';

export interface Subscription {
  enabled: boolean,
  id: string,
  name: string,
  config: SubscriptionConfig,
  condition?: (args: SubscriptionArgs) => Promise<boolean> | boolean,
  handler: (args: SubscriptionArgs) => Promise<void>
}