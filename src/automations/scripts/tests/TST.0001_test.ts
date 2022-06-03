import { App, AppSubscription } from "@haam/app/types";
import devices from '../../devices';

export default async function register(app: App): Promise<AppSubscription>{
  return {
    subscription: {
      byEntityEvent: {
        entityId: devices.climate.ventilation_system.entities.main
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