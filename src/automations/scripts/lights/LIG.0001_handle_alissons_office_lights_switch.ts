import { Console } from "console";
import { App } from "../../types/App";

export default async function register(app: App){
  app.haas.subscribe({
    id: "LIG.00001", 
    name: "Handle Alisson's Office Light Switch", 
    config: {
      byEntityEvent: {
        entityId: app.devices.switches.alissons_office_lights_switch.entities.main
      }
    },
    handler: async ({ entityEventArgs }) => {
      const state = entityEventArgs?.newState.state;

      if(state == "single_right"){
        await app.haas.instance.services.switch.toggle(app.devices.lighs.backyard_table_lights.entities.main)
      }else if(state == "double_right"){
        await app.haas.instance.services.switch.toggle(app.devices.lighs.backyard_pole_lights.entities.main)
      }else if(state == "triple_right"){
        await app.haas.instance.services.switch.toggle(app.devices.lighs.backyard_table_lights.entities.main)
        await app.haas.instance.services.switch.toggle(app.devices.lighs.backyard_pole_lights.entities.main)
      }
      if(state == "single_left"){
        await app.haas.instance.services.switch.toggle(app.devices.lighs.living_room_lamp.entities.main)
      }
    }
  })
}