import { App } from "../../types/App";
import { sendNotification } from "../../helpers/sendNotificationHelper";

export default async function register(app: App){
  return false;
  app.haas.subscribe({
    id: "RMD.00002", 
    name: "Reminder - Trash Day - Plastic", 
    config: {
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
      const isOnVacation = await app.haas.instance.states.getBoolean(app.devices.configuration.on_vocation.entities.main);
      return !isOnVacation
    },
    handler: async () => {
      sendNotification(app, {
        app: {
          title: "Reminder - Trash Day",
          message: "Today is organic trash day!"
        }
      })
    }
  })
}