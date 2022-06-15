import { AppContext } from "@haam/app/types";

const devices = {
  mobile: {
    alissons_iphone: {
      entities: {
        main: "mobile_app_alissons_iphone"
      }
    },
    brunas_iphone: {
      entities: {
        main: "mobile_app_brunas_iphone"
      }
    }
  },
  home: {
    calendars: {
      home: {
        entities: {
          main: "calendar.alvesrubim9294_gmail_com"
        }
      },
      cyclus: {
        entities: {
          main: "calendar.afvalkalender_cyclus_nv",
        },
        state_values: {
          paper_day: "Oud papier & karton",
          organic_day: "Oud papier & karton",
          plastic_day: "Plastic, metaal en drankenkartons",
          general_day: "Restafval"
        }
      }
    },
    modes: {
      vacation: {
        entities: { 
          main: "input_boolean.on_vacation",
        },
        states: {
          is_on: async (context: AppContext) => await context.states.getBoolean(devices.home.modes.vacation.entities.main) === true,
          is_off: async (context: AppContext) => await context.states.getBoolean(devices.home.modes.vacation.entities.main) === false,
        },
        actions: {
          turn_on: async (context: AppContext) => await context.services.input_boolean.turn_on(devices.home.modes.vacation.entities.main),
          turn_off: async (context: AppContext) => await context.services.input_boolean.turn_off(devices.home.modes.vacation.entities.main),
        }
      }
    },
    world: {
      sun: {
        entities: {
          main: "sun.sun"
        },
        states: {
          is_bellow_horizon: async (context: AppContext) => await context.states.getString(devices.home.world.sun.entities.main) === "below_horizon",
        }
      },
      weather: {
        entities: {
          main: "weather.home",
          forecast: "weather.buienradar"
        },
      },
    },
    configuration: {
      trash_day_type: {
        entities: {
          main: "input_select.trash_day_type",
        },
        states: {
          type: async (context: AppContext) => await context.states.getString(devices.home.configuration.trash_day_type.entities.main),
        },
        actions: {
          set_value: async (context: AppContext, option: string) => await context.services.input_select.select_option(devices.home.configuration.trash_day_type.entities.main, option),
        }
      },
      alarm_system: {
        entities: {
          main: "input_boolean.alarm_system",
        },
        actions: {
          turn_on: async (context: AppContext) => await context.services.input_boolean.turn_on(devices.home.configuration.alarm_system.entities.main),
          turn_off: async (context: AppContext) => await context.services.input_boolean.turn_off(devices.home.configuration.alarm_system.entities.main),
        },
        states: {
          is_on: async (context: AppContext) => await context.states.getBoolean(devices.home.configuration.alarm_system.entities.main) === true,
        }
      }
    },
    controls: {
      should_turn_off_backyard_lights_automatically: {
        entities: {
          main: "input_boolean.control_should_turn_off_backyard_lights_automatically"
        },
        states: {
          is_on: async (context: AppContext) => await context.states.getBoolean(devices.home.controls.should_turn_off_backyard_lights_automatically.entities.main) === true,
          is_off: async (context: AppContext) => await context.states.getBoolean(devices.home.controls.should_turn_off_backyard_lights_automatically.entities.main) === false,
        },
        actions: {
          turn_on: async (context: AppContext) => await context.services.input_boolean.turn_on(devices.home.controls.should_turn_off_backyard_lights_automatically.entities.main),
          turn_off: async (context: AppContext) => await context.services.input_boolean.turn_off(devices.home.controls.should_turn_off_backyard_lights_automatically.entities.main),
        }
      },
      should_turn_off_bathroom_ventilation_system_automatically: {
        entities: {
          main: "input_boolean.should_turn_off_bathroom_ventilation_system_automatically"
        },
        states: {
          is_on: async (context: AppContext) => await context.states.getBoolean(devices.home.controls.should_turn_off_bathroom_ventilation_system_automatically.entities.main) === true,
          is_off: async (context: AppContext) => await context.states.getBoolean(devices.home.controls.should_turn_off_bathroom_ventilation_system_automatically.entities.main) === false,
        },
        actions: {
          turn_on: async (context: AppContext) => await context.services.input_boolean.turn_on(devices.home.controls.should_turn_off_bathroom_ventilation_system_automatically.entities.main),
          turn_off: async (context: AppContext) => await context.services.input_boolean.turn_off(devices.home.controls.should_turn_off_bathroom_ventilation_system_automatically.entities.main),
        }
      }
    }
  },
  bathroom: {
    speakers: {
      google_mini: {
        entities: {
          main: "media_player.bathroom_speaker"
        }
      }
    },
    sensors: {
      temperature_and_humidity: {
        entities: {
          main: "sensor.bathroom_temperature_sensor_humidity",
        }
      }
    },
    switches: {
      ventilation: {
        entities: {
          main: "switch.ventilation_system"
        },
        actions: {
          turn_on: async (context: AppContext) => await context.services.switch.turn_on(devices.bathroom.switches.ventilation.entities.main),
          turn_off: async (context: AppContext) => await context.services.switch.turn_off(devices.bathroom.switches.ventilation.entities.main)
        },
        states: {
          is_on: async (context: AppContext) => await context.states.getBoolean(devices.bathroom.switches.ventilation.entities.main) === true,
          is_off: async (context: AppContext) => await context.states.getBoolean(devices.bathroom.switches.ventilation.entities.main) === false,
        }
      }
    }
  },
  kitchen: {
    sensors: {
      front_window: {
        entities: {
          main: "binary_sensor.kitchen_front_window_sensor_contact"
        },
        states: {
          is_open: async (context: AppContext) => await context.states.getBoolean(devices.kitchen.sensors.front_window.entities.main) === true,
          is_close: async (context: AppContext) => await context.states.getBoolean(devices.kitchen.sensors.front_window.entities.main) === false,
        },
        state_values: {
          open: "on",
          close: "off"
        }
      }
    }
  },
  living_room: {
    speakers: {
      google_display: {
        entities: {
          main: "media_player.living_room_display"
        }
      }
    },
    lights: {
      lamp: {
        entities: {
          main: "switch.living_room_lamp"
        },
        actions: {
          turn_on: async (context: AppContext) => await context.services.switch.turn_on(devices.living_room.lights.lamp.entities.main),
          turn_off: async (context: AppContext) => await context.services.switch.turn_off(devices.living_room.lights.lamp.entities.main),
          toggle: async (context: AppContext) => await context.services.switch.toggle(devices.living_room.lights.lamp.entities.main),
        },
        states: {
          is_on: async (context: AppContext) => await context.states.getBoolean(devices.living_room.lights.lamp.entities.main) === true,
          is_off: async (context: AppContext) => await context.states.getBoolean(devices.living_room.lights.lamp.entities.main) === false,
        }
      }
    },
    switch_controlls: {
      controll_1: {
        entities: {
          main: "sensor.living_room_lights_switch_01_action",
          baterry: "sensor.living_room_lights_switch_01_battery"
        }
      }
    },
    sensors: {
      back_door: {
        entities: {
          main: "binary_sensor.living_room_back_door_sensor_contact"
        },
        states: {
          is_open: async (context: AppContext) => await context.states.getBoolean(devices.living_room.sensors.back_door.entities.main) === true,
          is_close: async (context: AppContext) => await context.states.getBoolean(devices.living_room.sensors.back_door.entities.main) === false,
        },
        state_values: {
          open: "on",
          close: "off"
        }
      },
      back_window: {
        entities: {
          main: "binary_sensor.living_room_back_window_sensor_contact"
        },
        states: {
          is_open: async (context: AppContext) => await context.states.getBoolean(devices.living_room.sensors.back_window.entities.main) === true,
          is_close: async (context: AppContext) => await context.states.getBoolean(devices.living_room.sensors.back_window.entities.main) === false,
        },
        state_values: {
          open: "on",
          close: "off"
        }
      }
    }
  },
  master_bedroom: {
    fans: {
      white_fan: {
        entities: {
          main: "fan.white_ventilator"
        },
        actions: {
          turn_on: async (context: AppContext) => await context.services.fan.turn_on(devices.master_bedroom.fans.white_fan.entities.main),
          turn_off: async (context: AppContext) => await context.services.fan.turn_off(devices.master_bedroom.fans.white_fan.entities.main),
          toggle: async (context: AppContext) => await context.services.fan.toggle(devices.master_bedroom.fans.white_fan.entities.main),
        },
        states: {
          is_on: async (context: AppContext) => await context.states.getBoolean(devices.master_bedroom.fans.white_fan.entities.main) === true,
          is_off: async (context: AppContext) => await context.states.getBoolean(devices.master_bedroom.fans.white_fan.entities.main) === false,
        }
      }
    }
  },
  backyard: {
    lights: {
      table: {
        entities: {
          main: "switch.backyard_table_lights"
        },
        states: {
          is_on: async (context: AppContext) => await context.states.getBoolean(devices.backyard.lights.table.entities.main) === true,
          is_off: async (context: AppContext) => await context.states.getBoolean(devices.backyard.lights.table.entities.main) === false,
        }
      },
      pole: {
        entities: {
          main: "switch.backyard_pole_lights"
        },
        states: {
          is_on: async (context: AppContext) => await context.states.getBoolean(devices.backyard.lights.pole.entities.main) === true,
          is_off: async (context: AppContext) => await context.states.getBoolean(devices.backyard.lights.pole.entities.main) === false,
        }
      },
      all: {
        entities: {
          main: "switch.backyard_lights"
        },
        actions: {
          turn_on: async (context: AppContext) => await context.services.switch.turn_on(devices.backyard.lights.all.entities.main),
          turn_off: async (context: AppContext) => await context.services.switch.turn_off(devices.backyard.lights.all.entities.main),
          toggle: async (context: AppContext) => await context.services.switch.toggle(devices.backyard.lights.all.entities.main),
        },
        states: {
          is_on: async (context: AppContext) => await context.states.getBoolean(devices.backyard.lights.all.entities.main) === true,
          is_off: async (context: AppContext) => await context.states.getBoolean(devices.backyard.lights.all.entities.main) === false,
        }
      }
    },
  },
  entrance: {
    sensors: {
      frontdoor: {
        entities: {
          main: "binary_sensor.entrance_front_door_sensor_contact"
        },
        states: {
          is_open: async (context: AppContext) => await context.states.getBoolean(devices.entrance.sensors.frontdoor.entities.main) === true,
          is_close: async (context: AppContext) => await context.states.getBoolean(devices.entrance.sensors.frontdoor.entities.main) === false,
        },
        state_values: {
          open: "on",
          close: "off"
        }
      }
    }
  },
  alissons_office: {
    speakers: {
      google_mini: {
        entities: {
          main: "media_player.alissons_office_speaker"
        }
      }
    },
  }
}

export default devices;