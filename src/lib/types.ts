export type GHData = {
  week: string
  hour: number
  pull_requests: string
  issues: string
  branches: string
}

export type ParsedGHData = {
  count: number
  event: number
  hour: number
  week: Date
}

export type WeekAndTotal = {
  week: Date
  total: number
}

export type DataAndTime = {
  value: number
  date: string
}

export type FeltonData = Record<string, Date | number | string>
