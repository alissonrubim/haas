import { Subscription } from "@haas/core/types";

export interface AppSubscription {
  subscription: Subscription["config"],
  handler: Subscription["handler"],
  condition?: Subscription["condition"];
}