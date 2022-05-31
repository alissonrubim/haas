export default {
  configuration: {
    vaccum_cleaner_should_run_next_cleaning_automation: {
      entities: {
        main: "input_boolean.vaccum_cleaner_should_run_next_cleaning_automation"
      }
    },
    trash_reminder_schedule_time: {
      entities: {
        main: "input_datetime.trash_reminder_schedule_time"
      }
    },
    on_vocation: {
      entities: {
        main: "input_boolean.on_vacation"
      }
    }
  },
  climate: {
    ventilation_system: {
      entities: {
        main: "switch.ventilation_system"
      }
    }
  },
  cleaning: {
    vaccum_cleaner: {
      entities: {
        main: "vacuum.neato"
      }
    }
  },
  lighs: {
    backyard_pole_lights: {
      entities: {
        main: "switch.backyard_pole_lights"
      }
    },
    backyard_table_lights: {
      entities: {
        main: "switch.backyard_table_lights"
      }
    },
    living_room_lamp: {
      entities: {
        main: "switch.living_room_lamp"
      }
    }
  },
  switches: {
    alissons_office_lights_switch: {
      entities: {
        main: "sensor.alisson_s_office_lights_switch_action",
        baterry: "sensor.alisson_s_office_lights_switch_battery"
      }
    }
  }
}