import { App } from "../types/App";
import { NotificationRequest, AppNotificationRequest, VoiceNotificationRequest, MediaNotificationRequest } from "../types/Notification";
import { broadcastMessage } from "./audio/broadcastMessage";

function getAppEntities(entity: string | string[] | undefined): string[] {
  const alissonAppEntity = "mobile_app_alissons_iphone"
  const brunaAppEntity = "mobile_app_brunas_iphone"

  if(!entity)
    return [alissonAppEntity, brunaAppEntity];

  if(typeof entity === "string")
    entity = [entity];

  const resultEntities: string[] = [];
  (entity as string[]).forEach((e) => {
    if(e === "device_tracker.all"){
      resultEntities.push(alissonAppEntity);
      resultEntities.push(brunaAppEntity);
    }
    if(e === "device_tracker.alissons_iphone")  
      resultEntities.push(alissonAppEntity);
    if(e === "device_tracker.brunas_iphone")  
      resultEntities.push(brunaAppEntity);
  })

  return resultEntities;
}

function getMediaEntities(entity: string | string[] | undefined): string[]{
  if(!entity)
    return ["media_player.all_speakers"]

  if(typeof entity === "string")
    entity = [entity];  

  return entity as string[]
}

export async function sendNotification(app: App, notification: NotificationRequest){
  async function sendViaApp(notificationApp: AppNotificationRequest){
    getAppEntities(notificationApp?.entity).forEach(async (entity) => {
      await app.haas.instance.services.notify(entity, { 
        "title": notificationApp?.title,
        "message": notificationApp?.message,
        "data": {
          "actions": notificationApp?.actions
        }
      });
    })
  }

  async function sendViaVoice(notificationVoice: VoiceNotificationRequest){
    getMediaEntities(notificationVoice.entity).forEach(async (entity) => {
      await broadcastMessage(app, entity, notificationVoice.message, notificationVoice.volume)
    })
  }

  async function sendViaMedia(notificationMedia: MediaNotificationRequest){

  }

  if(notification.app)
    await sendViaApp(notification.app)
  
  if(notification.voice)
    await sendViaVoice(notification.voice)

  if(notification.media)
    await sendViaMedia(notification.media)
}