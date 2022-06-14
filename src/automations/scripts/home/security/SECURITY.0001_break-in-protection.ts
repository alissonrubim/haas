import { AppContext, AppSubscription } from "@haam/app/types";
import { TriggerConfig } from "@haam/core/haam/byTrigger/processSubscriptionsByTrigger";
import devices from '../../../devices';
import { sendNotification } from "../../../helpers/sendNotificationHelper";
import SecuritySensors from "../../../helpers/security/SecutirySensors";
import DisableAlarmSystemAction from '../../../helpers/security/DisableAlarmSystemAction'

const generateTrigger = (entity: any): TriggerConfig  => {
  return {
    platform: "state",
    entityId: entity.entities.main,
    from: entity.state_values.close,
    to: entity.state_values.open
  }
}

export default async function register(context: AppContext): Promise<AppSubscription[]>{
  return [{
    enabled: true,
    description: "Send a notification when someone is breaking in the house",
    subscription: {
      byTrigger: SecuritySensors.map((x) => generateTrigger(x))
    },
    condition: async (evt) => {
      const alarmSystemIsOn = await devices.home.configuration.alarm_system.states.is_on(context);
      return alarmSystemIsOn;
    },
    handler: async (evt) => {
      //Warn about with sensor is being violated
      await sendNotification(context, {
        app: {
          title: "Security System!",
          message: `Sensor ${evt.triggerEventArgs.to_state.attributes.friendly_name} was opened!`,
          actions: [{
            action: DisableAlarmSystemAction,
            title: "Disable Alarm System"
          }]
        }
      });

      //First step is to blink the living room lamp 3 times
      await devices.living_room.lights.lamp.actions.turn_on(context);

      for(let i = 0; i < 3; i++){
        await context.wait({ seconds: 1 })
        await devices.living_room.lights.lamp.actions.turn_off(context);
        await context.wait({ seconds: 1 })
        await devices.living_room.lights.lamp.actions.turn_on(context);
      }

      //Then wait 15 seconds
      await context.wait({ seconds: 15 });

      //Then if the alarm still on, means that it should fire the alarm
      let alarmSystemIsOn = await devices.home.configuration.alarm_system.states.is_on(context);
      if(alarmSystemIsOn){
        await sendNotification(context, {
          app: {
            title: "Security System!",
            message: `Someone is breaking into the house. Catched by ${evt.triggerEventArgs.to_state.attributes.friendly_name}.`,
            actions: [{
              action: DisableAlarmSystemAction,
              title: "Disable Alarm System"
            }]
          }
        });

        
        while(alarmSystemIsOn){
          await sendNotification(context, {
            voice: {
              message: `Someone is breaking into this house. Saving recording fotage and contacting Eufy Security System to reporting clime. The police will arrive in 4 minutes.`,
              volume: 0.5,
              entity: [
                devices.living_room.speakers.google_display.entities.main
              ]
            }
          });
          await context.wait({
            seconds: 30
          })
          alarmSystemIsOn = await devices.home.configuration.alarm_system.states.is_on(context);
        }
      }
    }
  }]
}