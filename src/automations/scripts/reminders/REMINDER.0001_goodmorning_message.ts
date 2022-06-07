import { AppContext, AppSubscription } from "@haam/app/types";
import { sendNotification } from "../../helpers/sendNotificationHelper";
import devices from '../../devices';

export default async function register(context: AppContext): Promise<AppSubscription[]>{
  return [{
    enabled: true,
    description: "Send a goodmorning message everyday",
    subscription: {
      byTrigger: {
        platform: "time",
        at: {
          hour: 8,
          minute: 45,
        }
      }
    },
    condition: async (evt) => {
      const isOnVacation = await devices.home.modes.vacation.states.is_on(context);
      return !isOnVacation;
    },
    handler: async (evt) => {
      const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

      const today = new Date();
      const month = months[today.getUTCMonth()]
      const dayOfMonth = today.getUTCDate();
      const dayOfWeek = weekdays[today.getUTCDay()];

      let messageOfTheDay = `Hi, good morning. Today is ${dayOfWeek}, ${dayOfMonth} of ${month}...`;

      const todayTrashType = await devices.home.configuration.trash_day_type.states.type(context);
      if(todayTrashType?.toLowerCase() != "none"){
        messageOfTheDay += `Do not forget to remove the trash, today is ${todayTrashType} trash day!`;
      }

      sendNotification(context, {
        voice: {
          message: messageOfTheDay
        }
      })
    }
  }]
}