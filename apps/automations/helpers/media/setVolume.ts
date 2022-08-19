import { AppContext } from "@haam/server/types";

export async function setVolume(context: AppContext, entity: string, volume: number){
  await context.services.media_player.set_volume(entity, volume)
}