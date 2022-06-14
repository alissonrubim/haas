import { AppContext, AppSubscription } from "@haam/app/types";
import devices from '../../../devices';

export default async function register(context: AppContext): Promise<AppSubscription[]>{
  const events = [
    {
      event: "turn_on_ventilation_system",
      onStart: async (evt: any) => await devices.bathroom.switches.ventilation.actions.turn_on(context),
      onEnd: async (evt: any) => await devices.bathroom.switches.ventilation.actions.turn_off(context),
    },
    {
      event: "turn_on_alarm_system",
      onStart: async (evt: any) => await devices.home.configuration.alarm_system.actions.turn_on(context),
      onEnd: async (evt: any) => await devices.home.configuration.alarm_system.actions.turn_off(context),
    },
    {
      event: "turn_off_masterbedroom_fan",
      onStart: async (evt: any) => await devices.master_bedroom.fans.white_fan.actions.turn_off(context),
      onEnd: async (evt: any) => {},
    },
    {
      event: "trun_on_vacation_mode",
      onStart: async (evt: any) => await devices.home.modes.vacation.actions.turn_on(context),
      onEnd: async (evt: any) => await devices.home.modes.vacation.actions.turn_off(context),
    }
  ]

  return [{
    enabled: true,
    description: "Base on the Home calendar, this script will take actions when the event starts",
    trigger: [{
      platform: "calendar",
      event: "start",
      entityId: devices.home.calendars.home.entities.main
    }],
    action: async (evt) => {
      const calendarEvent = evt.triggerEventArgs.calendar_event;
      const event = events.find((e) => `[${e.event}]` === calendarEvent.summary);
      if(event)
        await event.onStart(calendarEvent);
    }
  }, {
    enabled: true,
    description: "Base on the Home calendar, this script will take actions when the event ends",
    trigger: [{
      platform: "calendar",
      event: "end",
      entityId: devices.home.calendars.home.entities.main
    }],
    action: async (evt) => {
      const calendarEvent = evt.triggerEventArgs.calendar_event;
      const event = events.find((e) => `[${e.event}]` === calendarEvent.summary);
      if(event)
        await event.onEnd(calendarEvent);
    }
  }]
}