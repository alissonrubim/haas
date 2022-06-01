import { App } from "@haas/app/types/App";
import { wait } from "../../helpers/untils";
import { AppSubscription } from "@haas/app/types/appSubscription";
import devices from '../../devices';

export default async function register(app: App): Promise<AppSubscription>{
  return {
    subscription: {
      bySchedule: [{
        cron: {
          hour: 11,
          minute: {
            entity: devices.configuration.trash_reminder_schedule_time.entities.main,
          },
        }
      }, {
        cron: {
          hour: 17,
          minute: 0
        }
      }, {
        cron: {
          hour: 21,
          minute: 0
        }
      }]
    },
    handler: async () => {
      await app.haas.instance.services.switch.turn_on(devices.climate.ventilation_system.entities.main);

      await wait({ minutes: 15 });

      await app.haas.instance.services.switch.turn_off(devices.climate.ventilation_system.entities.main);
    }
  }
}