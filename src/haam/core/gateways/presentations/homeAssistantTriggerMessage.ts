import { HomeAssistantEntityState } from "./homeAssistantEntityState"

export interface HomeAssistantTriggerMessage {
  entity_id: string,
  from_state: HomeAssistantEntityState,
  to_state: HomeAssistantEntityState,
}