import { HomeAssistantEntityState } from "./homeAssistantEntityState"

export interface HomeAssistantStateChangeMessage {
  event_type: string,
  data: {
    entity_id: string,
    old_state: HomeAssistantEntityState,
    new_state: HomeAssistantEntityState
  },
  origin: 'LOCAL',
  time_fired: string,
  context: any
}