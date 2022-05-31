import { App } from "../../types/App";
import { wait } from "../../helpers/untils";
import { AppSubscription } from "../../types/AppSubscription";

export default async function register(app: App): Promise<AppSubscription>{
  return {
    subscription: {
      bySchedule: [{
        cron: {
          hour: 9,
          minute: 0
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
      await app.haas.instance.services.switch.turn_on(app.devices.climate.ventilation_system.entities.main);

      await wait({ minutes: 15 });

      await app.haas.instance.services.switch.turn_off(app.devices.climate.ventilation_system.entities.main);
    }
  }
}