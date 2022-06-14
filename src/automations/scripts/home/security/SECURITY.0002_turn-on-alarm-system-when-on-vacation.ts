import { AppContext, AppSubscription } from "@haam/app/types";
import devices from '../../../devices';
import { sendNotification } from "../../../helpers/sendNotificationHelper";

export default async function register(context: AppContext): Promise<AppSubscription[]>{
  return [{
    enabled: true,
    description: "When on_vacation is true, turn on alarm system",
    trigger: [{
      platform: "state",
      entityId: devices.home.modes.vacation.entities.main,
      from: 'off',
      to: 'on'
    }],
    action: async () => {
      await devices.home.configuration.alarm_system.actions.turn_on(context)
      await sendNotification(context,  {
        app: { 
          title: "Alarm System",
          message: "Alarm System is turned on and your home is protected! Have a nice vacation."
        }
      })
    }
  },{
    enabled: true,
    description: "When on_vacation is false, turn off alarm system",
    trigger: [{
      platform: "state",
      entityId: devices.home.modes.vacation.entities.main,
      from: 'on',
      to: 'off'
    }],
    action: async () => {
      await devices.home.configuration.alarm_system.actions.turn_off(context)
      await sendNotification(context,  {
        app: { 
          title: "Security System",
          message: "Well come back! Alarm system is turned off."
        }
      })
    }
  }]
}