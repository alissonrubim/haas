export default interface NotificationRequest {
  app?: {
    title: string,
    message: string,
    entity?: string | string[],
    actions?: {
      action: string,
      title: string,
      url?: string,
    }[]
  },
  voice?: {
    message: string,
    entity?: string | string[],
    volume?: number
  },
  media?: {
    type: string,
    path: string,
    entity?: string | string[],
    volume?: number
  }
}