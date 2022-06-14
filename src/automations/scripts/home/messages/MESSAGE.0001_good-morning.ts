import { AppContext, AppSubscription } from "@haam/app/types";
import { sendNotification } from "../../../helpers/sendNotificationHelper";
import devices from '../../../devices';

export default async function register(context: AppContext): Promise<AppSubscription[]>{
  return [{
    enabled: true,
    description: "Send a good morning message everyday",
    trigger: {
      platform: "time",
      at: {
        hour: 8,
        minute: 45,
      }
    },
    condition: async (evt) => {
      const isOnVacation = await devices.home.modes.vacation.states.is_on(context);
      return !isOnVacation;
    },
    action: async (evt) => {
      const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

      const today = new Date();
      const month = months[today.getUTCMonth()]
      const dayOfMonth = today.getUTCDate();
      const dayOfWeek = weekdays[today.getUTCDay()];

      const forecastEntity = await context.getEntity(devices.home.world.weather.entities.forecast);

      let messageOfTheDay = `Hi, good morning. Today is ${dayOfWeek}, ${dayOfMonth} of ${month}...`;
      messageOfTheDay += `The temperature outside is ${parseInt(forecastEntity?.attributes.temperature)} and it is ${forecastEntity?.state} today! \n`;

      const todayTrashType = await devices.home.configuration.trash_day_type.states.type(context);
      if(todayTrashType?.toLowerCase() != "none"){
        messageOfTheDay += `Do not forget to remove the trash, today is ${todayTrashType} trash day!`;
      }

      await sendNotification(context, {
        voice: {
          message: messageOfTheDay,
          entity: [
            devices.bathroom.speakers.google_mini.entities.main,
            devices.living_room.speakers.google_display.entities.main,
          ]
        }
      })
    }
  }]
}