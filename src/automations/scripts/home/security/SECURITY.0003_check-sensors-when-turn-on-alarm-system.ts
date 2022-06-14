import { AppContext, AppSubscription } from "@haam/app/types";
import devices from '../../../devices';
import { sendNotification } from "../../../helpers/sendNotificationHelper";

import SecuritySensors from "../../../helpers/security/SecutirySensors";

const getOpenSensors = async (context: AppContext): Promise<string[]> => {
  const openSensors: string[] = [];
  for(const index in SecuritySensors){
    const isOpen = await SecuritySensors[index].states.is_open(context);
    if(isOpen){
      openSensors.push(SecuritySensors[index].entities.main)
    }
  }
  return openSensors;
}

export default async function register(context: AppContext): Promise<AppSubscription[]>{
  return [{
    enabled: true,
    description: "When the alarm system is turned on, check is all the sensors are closed",
    subscription: {
      byTrigger: [{
        platform: "state",
        entityId: devices.home.configuration.alarm_system.entities.main,
        from: 'off',
        to: 'on'
      }]
    },
    condition: async () => {
      const openSensors = await getOpenSensors(context);
      return openSensors.length > 0
    },
    handler: async () => {
      const openSensors = await getOpenSensors(context);
      for(const index in openSensors){
        await sendNotification(context, {
          app: {
            title: "Security System",
            message: `Device ${openSensors[index]} is with an open state!`
          }
        })
      }
    }
  }]
}