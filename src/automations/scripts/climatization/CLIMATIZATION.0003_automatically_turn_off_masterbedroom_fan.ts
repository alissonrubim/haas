import { AppContext, AppSubscription } from "@haam/app/types";
import devices from '../../devices';

export default async function register(context: AppContext): Promise<AppSubscription[]>{
  return [{
    enabled: false,
    description: "Turn off mater bedroom fan everyday at morning",
    subscription: {
      byTrigger: {
        platform: "time_pattern",
        on_every: {
          hour: 9,
          minute: 0
        }
      }
    },
    condition: async (evt) => {
      const isFanOn = await devices.master_bedroom.fans.white_fan.states.is_on(context);
      return isFanOn;
    },
    handler: async (evt) => {
      await devices.master_bedroom.fans.white_fan.actions.turn_off(context);
    }
  }]
}