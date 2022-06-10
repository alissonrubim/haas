import { AppContext, AppSubscription } from "@haam/app/types";
import devices from '../../../devices';

type options = 
  "None" | 
  "Plastic" | 
  "Organic" | 
  "General" | 
  "Paper";

export default async function register(context: AppContext): Promise<AppSubscription[]>{
  return [{
    enabled: true,
    description: "Base on the Cyclus calender, this script will set the trash type for the day",
    subscription: {
      byTrigger: [{
        platform: "calendar",
        event: "start",
        entityId: devices.home.calendars.cyclus.entities.main
      }]
    },
    handler: async (evt) => {
      const calendarEvent = evt.triggerEventArgs.calendar_event;
      const eventSummary = calendarEvent.summary.toLowerCase();

      let trashType: options = "None";

      if(eventSummary === devices.home.calendars.cyclus.state_values.plastic_day.toLowerCase())
        trashType = "Plastic";
      else if(eventSummary === devices.home.calendars.cyclus.state_values.general_day.toLowerCase())
        trashType = "General";
      else if(eventSummary === devices.home.calendars.cyclus.state_values.paper_day.toLowerCase())
        trashType = "Paper";
      else  if(eventSummary === devices.home.calendars.cyclus.state_values.organic_day.toLowerCase())
        trashType = "General"

      await devices.home.configuration.trash_day_type.actions.set_value(context, trashType);
    }
  }]
}