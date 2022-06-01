import { App } from "@haas/app/types/App";
import { sendNotification } from "../../helpers/sendNotificationHelper";
import { AppSubscription } from "@haas/app/types/AppSubscription";
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
      const isOnVacation = await app.haas.instance.states.getBoolean(devices.configuration.on_vocation.entities.main);
      return !isOnVacation
    },
    handler: async () => {
      sendNotification(app, {
        app: {
          title: "Reminder - Trash Day",
          message: "Today is organic trash day!"
        },
        voice: {
          message: "Hi, good morning. Do not forget to remove the trash. Today is organic trash day!",
          volume: 60
        }
      })
    }
  }
}