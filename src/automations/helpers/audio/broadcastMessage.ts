import { AppContext } from "@haam/app/types";
import { setVolume } from "./setVolume";

export async function broadcastMessage(context: AppContext, entity: string, message: string, volume?: number){
  if(volume != undefined){
    await setVolume(context, entity, volume)
  }
  await context.services.tts(entity, message);
}