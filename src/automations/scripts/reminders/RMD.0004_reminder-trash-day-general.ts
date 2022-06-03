import { App, AppSubscription } from "@haam/app/types";
import { sendNotification } from "../../helpers/sendNotificationHelper";
import devices from '../../devices';

export default async function register(app: App): Promise<AppSubscription>{
  return {
    subscription: {
      bySchedule: {
        cron: {
          hour: [8, 10],
          minute: 30,
          weekDays: {
            monday: true
          }
        }
      }
    },
    condition: async () => {
      const isOnVacation = await app.core.instance.states.getBoolean(devices.configuration.on_vocation.entities.main);
      return !isOnVacation
    },
    handler: async () => {
      sendNotification(app, {
        app: {
          title: "Reminder - Trash Day",
          message: "Today is general trash day!"
        },
        voice: {
          message: "Hi, good morning. Do not forget to remove the trash. Today is general trash day!",
          volume: 60
        }
      })
    }
  }
}