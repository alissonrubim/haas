import { App } from "../../types/App";
import { AppSubscription } from "../../types/AppSubscription";

export default async function register(app: App): Promise<AppSubscription>{
  return {
    subscription: {
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
  }
}