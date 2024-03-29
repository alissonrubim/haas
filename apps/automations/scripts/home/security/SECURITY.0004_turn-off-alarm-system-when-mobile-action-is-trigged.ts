import { AppContext, AppSubscription } from "@haam/server/types";
import devices from '../../../devices';
import { sendNotification } from "../../../helpers/sendNotificationHelper";
import DisableAlarmSystemAction from '../../../helpers/security/DisableAlarmSystemAction'

export default async function register(context: AppContext): Promise<AppSubscription[]>{
  return [{
    enabled: true,
    description: "When on_vacation is true, turn on alarm system",
    trigger: [{
      platform: "event",
      eventType: "mobile_app_notification_action",
      eventData: {
        action: DisableAlarmSystemAction
      }
    }],
    action: async () => {
      await devices.home.configuration.alarm_system.actions.turn_off(context)
      await sendNotification(context,  {
        app: { 
          title: "Alarm System",
          message: "Alarm System is turned off by a mobile event."
        }
      })
    }
  }]
}