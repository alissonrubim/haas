import { AppContext } from "@haam/app/types";

export default {
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
          is_on: async (context: AppContext) => await context.states.getBoolean("input_boolean.on_vacation") === true,
          is_off: async (context: AppContext) => await context.states.getBoolean("input_boolean.on_vacation") === false,
        },
        actions: {
          turn_on: async (context: AppContext) => await context.services.input_boolean.turn_on("input_boolean.on_vacation"),
          turn_off: async (context: AppContext) => await context.services.input_boolean.turn_off("input_boolean.on_vacation"),
        }
      }
    },
    world: {
      sun: {
        entities: {
          main: "sun.sun"
        },
        states: {
          is_bellow_horizon: async (context: AppContext) => await context.states.getString("sun.sun") === "below_horizon",
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
          type: async (context: AppContext) => await context.states.getString("input_select.trash_day_type"),
        },
        actions: {
          set_value: async (context: AppContext, option: string) => await context.services.input_select.select_option("input_select.trash_day_type", option),
        }
      },
      alarm_system: {
        entities: {
          main: "input_boolean.alarm_system",
        },
        actions: {
          turn_on: async (context: AppContext) => await context.services.input_boolean.turn_on("input_boolean.alarm_system"),
          turn_off: async (context: AppContext) => await context.services.input_boolean.turn_off("input_boolean.alarm_system"),
        },
        states: {
          is_on: async (context: AppContext) => await context.states.getBoolean("input_boolean.alarm_system") === true,
        }
      }
    },
    controls: {
      should_turn_off_backyard_lights_automatically: {
        entities: {
          main: "input_boolean.control_should_turn_off_backyard_lights_automatically"
        },
        states: {
          is_on: async (context: AppContext) => await context.states.getBoolean("input_boolean.control_should_turn_off_backyard_lights_automatically") === true,
          is_off: async (context: AppContext) => await context.states.getBoolean("input_boolean.control_should_turn_off_backyard_lights_automatically") === false,
        },
        actions: {
          turn_on: async (context: AppContext) => await context.services.input_boolean.turn_on("input_boolean.control_should_turn_off_backyard_lights_automatically"),
          turn_off: async (context: AppContext) => await context.services.input_boolean.turn_off("input_boolean.control_should_turn_off_backyard_lights_automatically"),
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
          turn_on: async (context: AppContext) => await context.services.switch.turn_on("switch.ventilation_system"),
          turn_off: async (context: AppContext) => await context.services.switch.turn_off("switch.ventilation_system")
        },
        states: {
          is_on: async (context: AppContext) => await context.states.getBoolean("switch.ventilation_system") === true,
          is_off: async (context: AppContext) => await context.states.getBoolean("switch.ventilation_system") === false,
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
          turn_on: async (context: AppContext) => await context.services.switch.turn_on("switch.living_room_lamp"),
          turn_off: async (context: AppContext) => await context.services.switch.turn_off("switch.living_room_lamp"),
          toggle: async (context: AppContext) => await context.services.switch.toggle("switch.living_room_lamp"),
        },
        states: {
          is_on: async (context: AppContext) => await context.states.getBoolean("switch.living_room_lamp") === true,
          is_off: async (context: AppContext) => await context.states.getBoolean("switch.living_room_lamp") === false,
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
  },
  master_bedroom: {
    fans: {
      white_fan: {
        entities: {
          main: "fan.white_ventilator"
        },
        actions: {
          turn_on: async (context: AppContext) => await context.services.fan.turn_on("switch.white_ventilator"),
          turn_off: async (context: AppContext) => await context.services.fan.turn_off("switch.white_ventilator"),
          toggle: async (context: AppContext) => await context.services.fan.toggle("switch.white_ventilator"),
        },
        states: {
          is_on: async (context: AppContext) => await context.states.getBoolean("fan.white_ventilator") === true,
          is_off: async (context: AppContext) => await context.states.getBoolean("fan.white_ventilator") === false,
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
          is_on: async (context: AppContext) => await context.states.getBoolean("switch.backyard_table_lights") === true,
          is_off: async (context: AppContext) => await context.states.getBoolean("switch.backyard_table_lights") === false,
        }
      },
      pole: {
        entities: {
          main: "switch.backyard_pole_lights"
        },
        states: {
          is_on: async (context: AppContext) => await context.states.getBoolean("switch.backyard_pole_lights") === true,
          is_off: async (context: AppContext) => await context.states.getBoolean("switch.backyard_pole_lights") === false,
        }
      },
      all: {
        entities: {
          main: "switch.backyard_lights"
        },
        actions: {
          turn_on: async (context: AppContext) => await context.services.switch.turn_on("switch.backyard_lights"),
          turn_off: async (context: AppContext) => await context.services.switch.turn_off("switch.backyard_lights"),
          toggle: async (context: AppContext) => await context.services.switch.toggle("switch.backyard_lights"),
        },
        states: {
          is_on: async (context: AppContext) => await context.states.getBoolean("switch.backyard_lights") === true,
          is_off: async (context: AppContext) => await context.states.getBoolean("switch.backyard_lights") === false,
        }
      }
    },
    sensors: {
      backdoor: {
        entities: {
          main: "binary_sensor.backdoor_sensor_contact"
        },
        state_values: {
          open: "on",
          close: "off"
        }
      }
    }
  },
  entrance: {
    sensors: {
      frontdoor: {
        entities: {
          main: "binary_sensor.frontdoor_sensor_contact"
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