import { HomeAssistantEntityStateResponse } from "./homeAssistantEntityState.response"

export interface HomeAssistantStateChangeResponse {
  event_type: string,
  data: {
    entity_id: string,
    old_state: HomeAssistantEntityStateResponse,
    new_state: HomeAssistantEntityStateResponse
  },
  origin: 'LOCAL',
  time_fired: string,
  context: any
}