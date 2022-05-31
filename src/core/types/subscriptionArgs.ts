import { HomeAssistantEntityStateResponse } from "../gateways/presentations/homeAssistantEntityState.response";

export interface SubscriptionArgs {
  scheduleArgs?: {

  },
  entityEventArgs?: {
    entityId: string,
    newState: HomeAssistantEntityStateResponse,
    oldState: HomeAssistantEntityStateResponse
  }
}