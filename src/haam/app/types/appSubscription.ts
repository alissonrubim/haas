import { Subscription } from "@haam/core/types";

export interface AppSubscription {
  enabled?: boolean,
  description?: string,
  subscription: Subscription["config"],
  handler: Subscription["handler"],
  condition?: Subscription["condition"];
}