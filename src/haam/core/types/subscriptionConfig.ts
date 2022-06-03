export interface DateTimeEntity {
  entity: string,
  piece?: "year" | "month" | "day" | "hour" | "minute" | "second"
}

export type ByScheduleConfigCronField = "*" | "?" | number | DateTimeEntity | Array<number | DateTimeEntity>

export interface ByScheduleConfig {
  cron?: {
    second?: ByScheduleConfigCronField,
    minute?: ByScheduleConfigCronField,
    hour?: ByScheduleConfigCronField,
    day?: ByScheduleConfigCronField,
    month?: {
      january?: boolean,
      febuary?: boolean,
      march?: boolean,
      april?: boolean,
      may?: boolean,
      june?: boolean,
      july?: boolean,
      august?: boolean,
      september?: boolean,
      october?: boolean,
      november?: boolean,
      december?: boolean,
    },
    weekDays?: {
      sunday?: boolean,
      monday?: boolean,
      tuesday?: boolean,
      wednesday?: boolean,
      thursday?: boolean,
      friday?: boolean,
      saturday?: boolean
    }
  },
  expression?: string,
}


export interface SubscriptionConfig {
  bySchedule?: ByScheduleConfig | ByScheduleConfig[],
  byEntityEvent?: {
    entityId: string,
  }
}