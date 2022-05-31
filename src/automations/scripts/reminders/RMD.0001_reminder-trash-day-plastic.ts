import { App } from "../../types/App";
import { sendNotification } from "../../helpers/sendNotificationHelper";

export default async function register(app: App){
  app.haas.subscribe({
    id: "RMD.00001", 
    name: "Reminder - Trash Day - Plastic", 
    config: {
      bySchedule: {
        cron: {
          hour: {
            entity: app.devices.configuration.trash_reminder_schedule_time.entities.main,
          },
          minute: {
            entity: app.devices.configuration.trash_reminder_schedule_time.entities.main,
          },
          weekDays: {
            thursday: true
          }
        }
      }
    },
    condition: async () => {
      const isOnVacation = await app.haas.instance.states.getBoolean(app.devices.configuration.on_vocation.entities.main);
      return !isOnVacation
    },
    handler: async () => {
      sendNotification(app, {
        app: {
          title: "Reminder - Trash Day",
          message: "Today is plastic trash day!"
        }
      })
    }
  })
}