import { App } from "@haas/app/types/App";

export async function setVolume(app: App, entity: string, volume: number){
  await app.haas.instance.services.media_player.set_volume(entity, volume/100)
}