import { HomeAssistantEntityState } from "../gateways/presentations";

export interface SubscriptionArgs {
  scheduleArgs?: {

  },
  entityEventArgs?: {
    entityId: string,
    newState: HomeAssistantEntityState,
    oldState: HomeAssistantEntityState
  }
  triggerEventArgs?: any
}