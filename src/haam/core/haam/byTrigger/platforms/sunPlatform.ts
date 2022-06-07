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