
export interface TriggerSubscription {
  id: string,
  handler: (event: any) => Promise<void>
}