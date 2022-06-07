import { AppContext, AppSubscription } from "@haam/app/types";
import devices from '../../devices';

export default async function register(context: AppContext): Promise<AppSubscription[]>{
  return [{
    enabled: true,
    description: "Turn on livingroom lights when the frontdoor opens",
    subscription: {
      byTrigger: [{
        platform: "state",
        entityId: devices.entrance.sensors.frontdoor.entities.main,
        from: devices.entrance.sensors.frontdoor.state_values.close,
        to: devices.entrance.sensors.frontdoor.state_values.open
      }]
    },
    condition: async () => {
      return await devices.living_room.lights.lamp.states.is_off(context) && await devices.home.world.sun.states.is_bellow_horizon(context);
    },
    handler: async () => {
      await devices.living_room.lights.lamp.actions.turn_on(context)
    }
  }]
}