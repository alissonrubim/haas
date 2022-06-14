import { AppContext, AppSubscription } from "@haam/app/types";
import devices from '../devices';

export default async function register(context: AppContext): Promise<AppSubscription[]>{
  const humidyLevelThreshold = 75

  return [{
    enabled: true,
    description: "Turn off ventilation system to remove bathroom humidy when is high",
    trigger: {
      platform: "state",
      entityId: devices.bathroom.sensors.temperature_and_humidity.entities.main,
    },
    condition: async (evt) => {
      const isVentilationOff = await devices.bathroom.switches.ventilation.states.is_off(context);
      return isVentilationOff && parseFloat(evt.triggerEventArgs.to_state.state) >= humidyLevelThreshold;
    },
    action: async (evt) => {
      await devices.bathroom.switches.ventilation.actions.turn_on(context);
    }
  },
  {
    enabled: true,
    description: "Turn on ventilation system when bathroom humidy is low",
    trigger: {
      platform: "state",
      entityId: devices.bathroom.sensors.temperature_and_humidity.entities.main,
    },
    condition: async (evt) => {
      const isVentilationOn = await devices.bathroom.switches.ventilation.states.is_on(context);
      return isVentilationOn && parseFloat(evt.triggerEventArgs.to_state.state) < humidyLevelThreshold;
    },
    action: async (evt) => {
      await devices.bathroom.switches.ventilation.actions.turn_off(context);
    }
  }]
}