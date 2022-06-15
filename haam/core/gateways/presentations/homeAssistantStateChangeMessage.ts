import { HomeAssistantEntityState } from "./homeAssistantEntityState"
import { HomeAssistantMessage } from "./homeAssistantMessage"

export interface HomeAssistantStateChangeMessage extends HomeAssistantMessage {
  event: {
    event_type: string,
    data: {
      entity_id: string,
      old_state: HomeAssistantEntityState,
      new_state: HomeAssistantEntityState
    },
    origin: string,
    time_fired: string,
    context: any
  }
}