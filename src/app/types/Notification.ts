export interface AppNotificationRequest {
  title: string,
  message: string,
  entity?: string | string[],
  actions?: {
    action: string,
    title: string,
    url?: string,
  }[]
}

export interface VoiceNotificationRequest {
  message: string,
  entity?: string | string[],
  volume?: number
}

export interface MediaNotificationRequest {
  type: string,
  path: string,
  entity?: string | string[],
  volume?: number
}

export interface NotificationRequest {
  app?: AppNotificationRequest,
  voice?: VoiceNotificationRequest,
  media?: MediaNotificationRequest
}