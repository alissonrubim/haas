export interface HomeAssistantEntityState {
  entity_id: string,
  state: string,
  attributes: any,
  last_changed: string,
  last_updated: string,
  context: any
}