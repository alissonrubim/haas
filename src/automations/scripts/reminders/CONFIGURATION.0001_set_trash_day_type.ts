import { AppContext, AppSubscription } from "@haam/app/types";
import { sendNotification } from "../../helpers/sendNotificationHelper";
import devices from '../../devices';

export default async function register(context: AppContext): Promise<AppSubscription[]>{
  return [{
    enabled: true,
    description: "Set the trash day type based on the calendar",
    subscription: {
      byTrigger: [{
        platform: "calendar",
        event: "start",
        entityId: devices.home.calendars.cyclus.entities.main
      }]
    },
    handler: async (evt) => {
      type options = "None" | "Plastic" | "Organic" | "General" | "Paper";
      let trashType: options = "None";


      console.info(evt.triggerEventArgs)

      await devices.home.configuration.trash_day_type.actions.set_value(context, trashType);
    }
  }]
}