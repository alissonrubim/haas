import { App, AppSubscription } from "@haam/app/types";
import { sendNotification } from "../../helpers/sendNotificationHelper";
import devices from '../../devices';

export default async function register(app: App): Promise<AppSubscription>{
  return {
    subscription: {
      bySchedule: {
        cron: {
          hour: {
            entity: devices.configuration.trash_reminder_schedule_time.entities.main,
          },
          minute: {
            entity: devices.configuration.trash_reminder_schedule_time.entities.main,
          },
          weekDays: {
            thursday: true
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
          message: "Today is plastic trash day!"
        },
        voice: {
          message: "Hi, good morning. Do not forget to remove the trash. Today is plastic trash day!",
          volume: 60
        }
      })
    }
  }
}