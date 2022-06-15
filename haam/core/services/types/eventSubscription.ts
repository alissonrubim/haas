import { HomeAssistantEntityState } from "../../gateways/presentations";

export interface StateChangeSubscription {
  id: string,
  entityId: string,
  handler: (entityId: string, newState: HomeAssistantEntityState, oldState: HomeAssistantEntityState) => Promise<void>
}