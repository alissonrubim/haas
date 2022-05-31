import { App } from "../../types/App";

export default async function register(app: App){
  return false;
  app.haas.subscribe({
    id: "TST.00002", 
    name: "Test", 
    config: {
      byEntityEvent: {
        entityId: app.devices.climate.ventilation_system.entities.main
      }
    },
    condition: () => {
      return true
    },
    handler: async () => {
      console.info("Foi!")
    }
  })
}