import { App, AppSubscription } from "@haam/app/types";
import { wait } from "../../helpers/utils";
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
      await app.core.instance.services.switch.turn_on(devices.climate.ventilation_system.entities.main);

      await wait({ minutes: 15 });

      await app.core.instance.services.switch.turn_off(devices.climate.ventilation_system.entities.main);
    }
  }
}