import { AppContext, AppSubscription } from "@haam/app/types";
import { sendNotification } from "../../helpers/sendNotificationHelper";
import devices from '../../devices';

export default async function register(context: AppContext): Promise<AppSubscription[]> {
  return[];
  return [{
    subscription: {
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
      const isOnVacation = await context.states.getBoolean(devices.configuration.on_vocation.entities.main);
      return !isOnVacation
    },
    handler: async () => {
      const vaccumCleanerEntity = await context.getEntity(devices.cleaning.vaccum_cleaner.entities.main);
      const hasError = vaccumCleanerEntity?.state === "error"
      const hasBaterry = vaccumCleanerEntity?.attributes.baterry_level > 75;

      if(hasError || hasBaterry)
        return;

      await sendNotification(context, {
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
    
      await context.wait({ seconds: 20, minutes: 1 });

      const shoudlStartCleaning = await context.states.getBoolean(devices.configuration.vaccum_cleaner_should_run_next_cleaning_automation.entities.main);
      if(shoudlStartCleaning){
        await context.services.vaccum.start(devices.cleaning.vaccum_cleaner.entities.main)
      }else{
        await context.services.input_boolean.turn_on(devices.configuration.vaccum_cleaner_should_run_next_cleaning_automation.entities.main);
      }
    }
  }]
}