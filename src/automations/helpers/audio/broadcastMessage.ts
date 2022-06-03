import { App } from "@haam/app/types";
import { setVolume } from "./setVolume";

export async function broadcastMessage(app: App, entity: string, message: string, volume?: number){
  if(volume != undefined){
    await setVolume(app, entity, volume)
  }
  await app.core.instance.services.tts(entity, message);
}