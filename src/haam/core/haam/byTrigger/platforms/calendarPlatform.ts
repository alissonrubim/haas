export interface CalendarPlatform {
  platform: "calendar",
  event: "start" | "end",
  entityId: string,
  // offset?: string | {
  //   direction: "+" | "-",
  //   hour: number,
  //   minute: number,
  //   second?: number
  // }
}

export function calendarPlatformResolver(config: CalendarPlatform){
  // let offset: string | undefined = undefined;
  // if(config.offset){
  //   if(typeof config.offset === "string")
  //     offset = config.offset
  //   else{
  //     offset = `${config.offset.direction}${String(config.offset.hour).padStart(2, "0")}:${String(config.offset.minute).padStart(2, "0")}:${config.offset.second ? String(config.offset.second ?? 0).padStart(2, "0")}`
  //   }
  // }

  return {
    platform: "calendar",
    event: config.event,
    entity_id: config.entityId,
  }
}


/*
{
  id: '0',
  idx: '0',
  platform: 'calendar',
  event: 'start',
  calendar_event: {
    start: '2022-06-08T17:00:00+02:00',
    end: '2022-06-08T17:30:00+02:00',
    summary: 'Um test 2',
    all_day: false,
    description: 'Corpo do teste 2'
  }
}
*/