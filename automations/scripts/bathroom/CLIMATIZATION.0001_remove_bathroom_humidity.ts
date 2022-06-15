import { AppContext, AppSubscription } from "@haam/app/types";
import { StatePlatformEventArgs } from "@haam/core/haam/platforms";
import devices from '../../devices';

export default async function register(context: AppContext): Promise<AppSubscription[]>{
  const humidyLevelThreshold = 75

  return [{
    enabled: true,
    description: "Turn on ventilation system to remove bathroom humidy when is high",
    trigger: {
      platform: "state",
      entityId: devices.bathroom.sensors.temperature_and_humidity.entities.main,
    },
    condition: async (evt) => {
      const isVentilationOff = await devices.bathroom.switches.ventilation.states.is_off(context);
      const humidyIsHigh = parseFloat((evt as StatePlatformEventArgs).data.to_state.state) >= humidyLevelThreshold;
      return isVentilationOff && humidyIsHigh;
    },
    action: async (evt) => {
      await devices.bathroom.switches.ventilation.actions.turn_on(context);
      await devices.home.controls.should_turn_off_bathroom_ventilation_system_automatically.actions.turn_on(context);
    }
  },
  {
    enabled: true,
    description: "Turn off ventilation system when bathroom humidy is low",
    trigger: {
      platform: "state",
      entityId: devices.bathroom.sensors.temperature_and_humidity.entities.main,
    },
    condition: async (evt) => {
      const isVentilationOn = await devices.bathroom.switches.ventilation.states.is_on(context);
      const shouldTurnOff = await devices.home.controls.should_turn_off_bathroom_ventilation_system_automatically.states.is_on(context);
      const humidyIsLow = parseFloat((evt as StatePlatformEventArgs).data.to_state.state) < humidyLevelThreshold;
      return shouldTurnOff && isVentilationOn && humidyIsLow;
    },
    action: async (evt) => {
      await devices.bathroom.switches.ventilation.actions.turn_off(context);
      await devices.home.controls.should_turn_off_bathroom_ventilation_system_automatically.actions.turn_off(context);
    }
  }]
}