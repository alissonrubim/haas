export interface SunPlatform {
  platform: "sun",
  event: string,
  offset: string
}

export function sunPlatformResolver(config: SunPlatform){
  return {
    platform: "sun",
    event: config.event,
    offste: config.offset
  }
}

export interface SunPlatformEventArgs {
  platform: "sun",
  data: {
    id: string,
    idx: string,
    platform: string,
    //MISSING....
  }
}