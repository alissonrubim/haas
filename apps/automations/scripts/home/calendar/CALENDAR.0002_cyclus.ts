import { AppContext, AppSubscription } from "@haam/server/types";
import { CalendarPlatformEventArgs } from "@haam/core/processors/platforms";;
import devices from '../../../devices';

enum TrashOptions {
  "None" = "None",
  "Plastic" = "Plastic",
  "Organic" = "Organic", 
  "General" = "General", 
  "Paper" = "Paper"
}

export default async function register(context: AppContext): Promise<AppSubscription[]>{
  return [{
    enabled: true,
    description: "Base on the Cyclus calender, this script will set the trash type for the day",
    trigger: [{
      platform: "calendar",
      event: "start",
      entityId: devices.home.calendars.cyclus.entities.main
    }],
    action: async (evt) => {
      const calendarEvent = (evt as CalendarPlatformEventArgs).data.calendar_event;
      const eventSummary = calendarEvent.summary.toLowerCase();

      let trashType: TrashOptions = TrashOptions.None;

      if(eventSummary === devices.home.calendars.cyclus.state_values.plastic_day.toLowerCase())
        trashType = TrashOptions.Plastic;
      else if(eventSummary === devices.home.calendars.cyclus.state_values.general_day.toLowerCase())
        trashType = TrashOptions.General;
      else if(eventSummary === devices.home.calendars.cyclus.state_values.paper_day.toLowerCase())
        trashType = TrashOptions.Paper;
      else  if(eventSummary === devices.home.calendars.cyclus.state_values.organic_day.toLowerCase())
        trashType = TrashOptions.Organic;

      await devices.home.configuration.trash_day_type.actions.set_value(context, String(trashType));
    }
  },{
    enabled: true,
    description: "Just before midnight, reset the trash type",
    trigger: {
      platform: "time",
      at: {
        hour: 23,
        minute: 30
      }
    },
    condition: async (evt) => {
      const trashType = await devices.home.configuration.trash_day_type.states.type(context);
      return trashType?.toLocaleLowerCase() !== String(TrashOptions.None).toLocaleLowerCase()
    },
    action: async (evt) => {
      await devices.home.configuration.trash_day_type.actions.set_value(context, String(TrashOptions.None));
    }
  }]
}