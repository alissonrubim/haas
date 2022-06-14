export interface StatePlatform {
  platform: "state",
  entityId: string | string[],
  from?: string | number | boolean,
  to?: string | number | boolean
}

export function statePlatformResolver(config: StatePlatform){
  return {
    platform: "state",
    entity_id: config.entityId,
    from: config.from,
    to: config.to
  }
}

export interface StatePlatformEventArgs {
  platform: "state",
  data: {
    id: string,
    idx: string,
    platform: string,
    entity_id: string,
    from_state: {
      entity_id: string,
      state: string,
      attributes?: any
      last_changed: Date,
      last_updated: Date
    },
    to_state: {
      entity_id: string,
      state: string,
      attributes?: any
      last_changed: Date,
      last_updated: Date
    }
  }
}