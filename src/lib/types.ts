export type Data = {
  week: string;
  hour: number;
  pull_requests: string;
  issues: string;
  branches: string;
};
export type InputData = {
  data: Data[];
};
export type ParsedData = {
  count: number
  event: number
  hour: number
  week: Date
};
export type WeekAndTotal = {
  week: Date
  total: number
}

export type DataAndTime = {
  value: number;
  date: string;
};
