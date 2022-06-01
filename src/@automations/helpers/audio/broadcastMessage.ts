import { App } from "@haas/app/types/App";
import { setVolume } from "./setVolume";

export async function broadcastMessage(app: App, entity: string, message: string, volume?: number){
  if(volume != undefined){
    await setVolume(app, entity, volume)
  }
  await app.haas.instance.services.tts(entity, message);
}