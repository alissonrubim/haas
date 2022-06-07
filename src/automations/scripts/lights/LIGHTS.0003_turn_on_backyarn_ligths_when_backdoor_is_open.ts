import { AppContext, AppSubscription } from "@haam/app/types";
import devices from '../../devices';

export default async function register(context: AppContext): Promise<AppSubscription[]>{
  let shouldTurnOffAutomatically = false;

  return [{
    enabled: true,
    description: "Turn on backyard lights when the backdoor opens",
    subscription: {
      byTrigger: [{
        platform: "state",
        entityId: devices.backyard.sensors.backdoor.entities.main,
        from: devices.backyard.sensors.backdoor.state_values.close,
        to: devices.backyard.sensors.backdoor.state_values.open
      }]
    },
    condition: async () => {
      return await devices.backyard.lights.all.states.is_off(context) && await devices.home.world.sun.states.is_bellow_horizon(context);
    },
    handler: async () => {
      await devices.backyard.lights.all.actions.turn_on(context),
      shouldTurnOffAutomatically = true;
    }
  }
  , 
  {
    enabled: true,
    description: "Turn off backyard lights when the backdoor closes",
    subscription: {
      byTrigger: [{
        platform: "state",
        entityId: devices.backyard.sensors.backdoor.entities.main,
        from: devices.backyard.sensors.backdoor.state_values.open,
        to: devices.backyard.sensors.backdoor.state_values.close
      }]
    },
    condition: async () => {
      const lightsAreOn = await devices.backyard.lights.pole.states.is_on(context) || await devices.backyard.lights.table.states.is_on(context)
      return shouldTurnOffAutomatically && lightsAreOn && await devices.home.world.sun.states.is_bellow_horizon(context);
    },
    handler: async () => {
      await context.wait({ seconds: 30 })
      await devices.backyard.lights.all.states.is_off(context)
      shouldTurnOffAutomatically = false;
    }
  }]
}