
import { AppContext, AppSubscription } from "@haam/app/types";
import { Console } from "console";
import devices from '../devices';

export default async function register(context: AppContext): Promise<AppSubscription[]>{
  let isRunning = false;
  return [{
    enabled: false,
    subscription: {
      byTrigger: {
        platform: "mqtt",
        topic: "zigbee2mqtt/Alisson's Office Cube",
      }
    },
    handler: async (evt) => {
      const state_actions: {[key: string]: {
        [key: string]: () => Promise<void>
      }} = {
        side_0: {
          shake: async () => { console.info("Shake 0")},
          rotate_right: async () => {},
          rotate_left: async () => {},
        },
        side_1: {
          shake: async () => {},
          rotate_right: async () => {},
          rotate_left: async () => {},
        },
        side_2: {
          shake: async () => {},
          rotate_right: async () => {},
          rotate_left: async () => {},
        },
        side_3: {
          shake: async () => {},
          rotate_right: async () => {},
          rotate_left: async () => {},
        },
        side_4: {
          shake: async () => {},
          rotate_right: async () => {},
          rotate_left: async () => {},
        },
        side_5: {
          shake: async () => {},
          rotate_right: async () => {},
          rotate_left: async () => {},
        },
        side_any: {
          shake: async () => {},
          rotate_right: async () => {},
          rotate_left: async () => {},
        }
      }

      const action = evt.triggerEventArgs?.payload_json.action;
      const side = evt.triggerEventArgs?.payload_json.side;

      if(state_actions[`side_${side}`][action])
        state_actions[`side_${side}`][action]();
      if( state_actions[`side_any`][action])
        state_actions[`side_any`][action]();

      // if(!isRunning){
      //   isRunning = true;
      //   const action = evt.triggerEventArgs?.payload_json.action ?? '';
      //   const side = evt.triggerEventArgs?.payload_json.side ?? -1;
      //   if(action && side > -1){
      //     if(side === 2){
      //       const alissonsOfficeStrip = await context.getEntity(devices.lighs.alissons_office_light_strip.entities.main)
      //       if(action === "shake"){
      //         await context.services.light.toggle(devices.lighs.alissons_office_light_strip.entities.main)
      //       }
      //       if(action === "rotate_right"){
      //         if(alissonsOfficeStrip?.attributes.brightness < 255){
      //           await context.services.light.turn_on(devices.lighs.alissons_office_light_strip.entities.main, {
      //             brightness: alissonsOfficeStrip?.attributes.brightness + 35
      //           })
      //         }
      //       }
      //       if(action === "rotate_left"){
      //         console.info(alissonsOfficeStrip?.attributes.brightness)
      //         if(alissonsOfficeStrip?.attributes.brightness > 0){
      //           const newBrigthness = alissonsOfficeStrip?.attributes.brightness - 35;
      //           await context.services.light.turn_on(devices.lighs.alissons_office_light_strip.entities.main, {
      //             brightness: newBrigthness < 0 ? 5 : newBrigthness
      //           })
      //         }
      //       }
      //       if(action === "tap"){
      //         await context.services.light.turn_on(devices.lighs.alissons_office_light_strip.entities.main, {
      //           rgb_color: [255, 0, 0]
      //         })
      //       }
      //     }

      //     if(side === 0){
      //       const spotfy = await context.getEntity("media_player.spotify_alisson_rubim")

      //       function calculateVolume(increse: boolean){
      //         const angle =  Math.abs(evt.triggerEventArgs?.payload_json.action_angle)
      //         const anglePivot = angle * 0.3;
      //         const realVolume = spotfy?.attributes.volume_level * 100;
      //         const newLevel =  (realVolume + (increse ? 1 : -1) * anglePivot)/100;
      //         if(increse)
      //           return newLevel > 1 ? 1 : newLevel
      //         else
      //           return newLevel < 0 ? 0 : newLevel;
      //       }

            
      //       if(action === "rotate_right"){
      //         await context.services.media_player.set_volume("media_player.spotify_alisson_rubim", calculateVolume(true))
      //       }
      //       if(action === "rotate_left"){
      //         const newLevel = spotfy?.attributes.volume_level * 100 - Math.abs(evt.triggerEventArgs?.payload_json.action_angle)/10;
      //         await context.services.media_player.set_volume("media_player.spotify_alisson_rubim", calculateVolume(false))
      //       }

      //       if(action === "tap"){
      //         await context.services.media_player.media_play_pause("media_player.spotify_alisson_rubim")
      //       }
      //     }
      //   }
      // }
      // isRunning = false;
    }
  }]
}