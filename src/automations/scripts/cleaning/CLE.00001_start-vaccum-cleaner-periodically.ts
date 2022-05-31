import { App } from "../../types/App";
import { wait } from "../../helpers/untils";
import { sendNotification } from "../../helpers/sendNotificationHelper";

export default async function register(app: App){
  return false;
  app.haas.subscribe({
    id: "CLE.00001", 
    name: "Start Vaccum Cleaner Periodically", 
    config: {
      bySchedule: {
        cron: {
          hour: 12,
          minute: 50,
          weekDays: {
            tuesday: true,
            thursday: true,
            saturday: true
          }
        }
      }
    },
    condition: async () => {
      const isOnVacation = await app.haas.instance.states.getBoolean(app.devices.configuration.on_vocation.entities.main);
      return !isOnVacation
    },
    handler: async () => {
      const vaccumCleanerEntity = await app.haas.instance.getEntity(app.devices.cleaning.vaccum_cleaner.entities.main);
      const hasError = vaccumCleanerEntity?.state === "error"
      const hasBaterry = vaccumCleanerEntity?.attributes.baterry_level > 75;

      if(hasError || hasBaterry)
        return;

      await sendNotification(app, {
        app: {
          title: "Vaccumm Cleaner will start in 5 minutes",
          message: "Vaccumm Cleaner will start in 5 minutes, do not forget to make space for it!",
          actions: [{
            action: "turn_off.input_boolean.nodered_enable_vaccum_cleaner_automation",
            title: "Disabled for today"
          }]
        },
        voice: {
          message: "Hi, Vaccumm Cleaner will start in 5 minutes.",
          volume: 0.3
        }
      });
    
      await wait({ seconds: 20, minutes: 1 });

      const shoudlStartCleaning = await app.haas.instance.states.getBoolean(app.devices.configuration.vaccum_cleaner_should_run_next_cleaning_automation.entities.main);
      if(shoudlStartCleaning){
        await app.haas.instance.services.vaccum.start(app.devices.cleaning.vaccum_cleaner.entities.main)
      }else{
        await app.haas.instance.services.input_boolean.turn_on(app.devices.configuration.vaccum_cleaner_should_run_next_cleaning_automation.entities.main);
      }
    }
  })
}