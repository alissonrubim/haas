export interface TimePatternPlatform {
  platform: "time_pattern",
  on_every?: {
    hour?: number | "*",
    minute?: number | "*",
    second?: number | "*"
  },
  on_interval?: {
    hour?: number,
    minute?: number,
    second?: number
  }
}

export function timePatternPlatformResolver(config: TimePatternPlatform){
  if(!config.on_every && !config.on_interval)
    throw new Error("At least one property `on_every` or `on_interval` should be configured for a time_pattern.");

  if(config.on_every && config.on_interval)
    throw new Error("You can't configure a time_pattern with both `on_every` and `on_interval`.");

  let data = {};
  if(config.on_every){
    data = {
      hours: config.on_every.hour ? `${config.on_every.hour}` : undefined,
      minutes: config.on_every.minute ? `${config.on_every.minute}` : undefined,
      seconds: config.on_every.second ? `${config.on_every.second}` : undefined,
    }
  }else if(config.on_interval){
    data = {
      hours: config.on_interval.hour ? `/${config.on_interval.hour}` : undefined,
      minutes: config.on_interval.minute ? `/${config.on_interval.minute}` : undefined,
      seconds: config.on_interval.second ? `/${config.on_interval.second}` : undefined,
    }
  }

  return {
    platform: "time_pattern",
    ...data
  }
}

export interface TimePatternPlatformEventArgs {
  platform: "time_pattern",
  data: {
    id: string,
    idx: string,
    platform: string,
    //MISSING....
  }
}