import { Console } from "console";
import { App } from "@haas/app/types/App";
import { AppSubscription } from "@haas/app/types/AppSubscription";
import devices from '../../devices';

export default async function register(app: App): Promise<AppSubscription>{
  return {
    subscription: {
      byEntityEvent: {
        entityId: devices.switches.alissons_office_lights_switch.entities.main
      }
    },
    handler: async ({ entityEventArgs }) => {
      const state = entityEventArgs?.newState.state;

      if(state == "single_right"){
        await app.haas.instance.services.switch.toggle(devices.lighs.backyard_table_lights.entities.main)
      }else if(state == "double_right"){
        await app.haas.instance.services.switch.toggle(devices.lighs.backyard_pole_lights.entities.main)
      }else if(state == "triple_right"){
        await app.haas.instance.services.switch.toggle(devices.lighs.backyard_table_lights.entities.main)
        await app.haas.instance.services.switch.toggle(devices.lighs.backyard_pole_lights.entities.main)
      }
      if(state == "single_left"){
        await app.haas.instance.services.switch.toggle(devices.lighs.living_room_lamp.entities.main)
      }
    }
  }
}