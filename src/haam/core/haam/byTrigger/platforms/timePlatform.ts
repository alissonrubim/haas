interface AtProperty { 
  second?: number,
  minute: number,
  hour: number
}

export interface TimePlatform {
  platform: "time",
  at: string | AtProperty
}

export function timePlatformResolver(config: TimePlatform){
  const calculateAt = (at: AtProperty) => {
    return `${String(at.hour).padStart(2, "0")}:${String(at.minute).padStart(2, "0")}:${String(at.second ?? 0).padStart(2, "0")}`
  }
  
  const at = typeof config.at === "string" ? config.at : calculateAt(config.at as AtProperty);
  return {
    platform: "time",
    at
  }
}