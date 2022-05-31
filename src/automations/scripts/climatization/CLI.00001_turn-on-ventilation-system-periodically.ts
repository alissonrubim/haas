import { App } from "../../types/App";
import { wait } from "../../helpers/untils";

export default async function register(app: App){
  return false;
  app.haas.subscribe({
    id: "CLI.00001", 
    name: "Turn On Vertilation System Periodically", 
    config: {
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
  })
}