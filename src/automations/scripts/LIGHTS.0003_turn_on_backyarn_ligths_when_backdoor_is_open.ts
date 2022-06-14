import { AppContext, AppSubscription } from "@haam/app/types";
import devices from '../devices';

export default async function register(context: AppContext): Promise<AppSubscription[]>{
  return [{
    enabled: true,
    description: "Turn on backyard lights when the backdoor opens",
    trigger: [{
      platform: "state",
      entityId: devices.living_room.sensors.back_door.entities.main,
      from: devices.living_room.sensors.back_door.state_values.close,
      to: devices.living_room.sensors.back_door.state_values.open
    }],
    condition: async () => {
      return await devices.backyard.lights.all.states.is_off(context) && await devices.home.world.sun.states.is_bellow_horizon(context);
    },
    action: async () => {
      await devices.backyard.lights.all.actions.turn_on(context),
      await devices.home.controls.should_turn_off_backyard_lights_automatically.actions.turn_on(context);
    }
  },{
    enabled: true,
    description: "Turn off backyard lights when the backdoor closes",
    trigger: [{
      platform: "state",
      entityId: devices.living_room.sensors.back_door.entities.main,
      from: devices.living_room.sensors.back_door.state_values.open,
      to: devices.living_room.sensors.back_door.state_values.close
    }],
    condition: async () => {
      const lightsAreOn = await devices.backyard.lights.pole.states.is_on(context) || await devices.backyard.lights.table.states.is_on(context)
      const shouldTurnOffAutomatically = await devices.home.controls.should_turn_off_backyard_lights_automatically.states.is_on(context);
      return shouldTurnOffAutomatically && lightsAreOn && await devices.home.world.sun.states.is_bellow_horizon(context);
    },
    action: async () => {
      await context.wait({ seconds: 30 })
      await devices.backyard.lights.all.states.is_off(context)
      await devices.home.controls.should_turn_off_backyard_lights_automatically.actions.turn_off(context);
    }
  }]
}