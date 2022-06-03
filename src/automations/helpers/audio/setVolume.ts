import { App } from "@haam/app/types";

export async function setVolume(app: App, entity: string, volume: number){
  await app.core.instance.services.media_player.set_volume(entity, volume/100)
}