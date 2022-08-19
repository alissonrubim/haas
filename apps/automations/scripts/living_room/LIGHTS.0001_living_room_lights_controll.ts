import { AppContext, AppSubscription } from "@haam/server/types";
import { StatePlatformEventArgs } from "@haam/core/processors/platforms";;
import devices from '../../devices';

export default async function register(context: AppContext): Promise<AppSubscription[]>{
  return [{
    enabled: true,
    description: "Setup each action for the living room switch controll 01",
    trigger: {
      platform: "state",
      entityId: devices.living_room.switch_controlls.controll_1.entities.main
    },
    condition: async (evt) => {
      return (evt as StatePlatformEventArgs).data.to_state.state !== ""
    },
    action: async (evt) => {
      const state_actions: {[key: string]: () => Promise<void>} = {
        single_left: async () => { await devices.living_room.lights.lamp.actions.toggle(context) },
        double_left: async () => {},
        triple_left: async () => {},
        hold_left: async () => await devices.living_room.lights.lamp.actions.turn_off(context),

        single_right: async () => { await devices.backyard.lights.all.actions.toggle(context)},
        double_right: async () => {},
        triple_right: async () => {},
        hold_right: async () => { await devices.backyard.lights.all.actions.turn_off(context) },

        single_both: async () => {},
        double_both: async () => {},
        triple_both: async () => {},
        hold_both: async () => {},
      }

      const state = (evt as StatePlatformEventArgs).data.to_state.state;
      if(state_actions[state])
        await state_actions[state]();
    }
  }]
}