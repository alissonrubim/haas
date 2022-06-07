import { AppContext, AppSubscription } from "@haam/app/types";
import devices from '../../devices';

export default async function register(context: AppContext): Promise<AppSubscription[]>{
  return [{
    enabled: true,
    description: "Turn on ventitilation periodically",
    subscription: {
      byTrigger: [{
        platform: "time_pattern",
        on_every: {
          hour: 9,
          minute: 0
        }
      }, {
        platform: "time_pattern",
        on_every: {
          hour: 17,
          minute: 0
        }
      }, {
        platform: "time_pattern",
        on_every: {
          hour: 21,
          minute: 0
        }
      }]
    },
    handler: async () => {
      await devices.bathroom.switches.ventilation.actions.turn_on(context);
      await context.wait({ minutes: 15 });
      await devices.bathroom.switches.ventilation.actions.turn_off(context);
    }
  }]
}