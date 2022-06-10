import { AppContext, AppSubscription } from "@haam/app/types";
import devices from '../../../devices';
import { sendNotification } from "../../../helpers/sendNotificationHelper";

export default async function register(context: AppContext): Promise<AppSubscription[]>{
  return [{
    enabled: true,
    description: "Send a notification when someone is invading the house",
    subscription: {
      byTrigger: [{
        platform: "state",
        entityId: devices.entrance.sensors.frontdoor.entities.main,
        from: devices.entrance.sensors.frontdoor.state_values.close,
        to: devices.entrance.sensors.frontdoor.state_values.open
      }]
    },
    condition: async () => {
      const isOnVacation = await devices.home.modes.vacation.states.is_on(context);
      const alarmSystemIsOn = await devices.home.configuration.alarm_system.states.is_on(context);
      return isOnVacation || alarmSystemIsOn;
    },
    handler: async () => {
      sendNotification(context, {
        app: {
          title: "Frontdoor Warning!",
          message: "Someone is invading by the frontdoor!"
        }
      })
    }
  }]
}