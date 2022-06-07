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


/*

{
  id: '0',
  idx: '0',
  platform: 'state',
  entity_id: 'sensor.bathroom_temperature_sensor_humidity',
  from_state: {
    entity_id: 'sensor.bathroom_temperature_sensor_humidity',
    state: '91.99',
    attributes: {
      state_class: 'measurement',
      unit_of_measurement: '%',
      device_class: 'humidity',
      friendly_name: 'Bathroom Temperature Sensor humidity'
    },
    last_changed: '2022-06-04T10:14:48.690297+00:00',
    last_updated: '2022-06-04T10:14:48.690297+00:00',
    context: {
      id: '01812e35d472db1ff7e530e533fa4889',
      parent_id: null,
      user_id: null
    }
  },
  to_state: {
    entity_id: 'sensor.bathroom_temperature_sensor_humidity',
    state: '93.33',
    attributes: {
      state_class: 'measurement',
      unit_of_measurement: '%',
      device_class: 'humidity',
      friendly_name: 'Bathroom Temperature Sensor humidity'
    },
    last_changed: '2022-06-04T10:26:21.298974+00:00',
    last_updated: '2022-06-04T10:26:21.298974+00:00',
    context: {
      id: '01812e4065f2c9d591db352267b2896f',
      parent_id: null,
      user_id: null
    }
  },
  for: null,
  attribute: null,
  description: 'state of sensor.bathroom_temperature_sensor_humidity'
}*/