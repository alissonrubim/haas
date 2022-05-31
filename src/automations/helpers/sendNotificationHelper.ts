import { Haas } from "@haas/core";
import { App } from "../types/App";
import NotificationRequest from "../types/Notification";

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

export async function sendNotification(app: App, notification: NotificationRequest){
  async function sendViaApp(notificationApp: NotificationRequest["app"]){
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

  async function sendViaVoice(){

  }

  async function sendViaMedia(){

  }


  if(notification.app)
    await sendViaApp(notification.app)
}