import { Subscription } from "../../haam-core/types";

export interface AppSubscription {
  enabled?: boolean,
  description?: string,
  trigger: Subscription["trigger"],
  action: Subscription["action"],
  condition?: Subscription["condition"];
}