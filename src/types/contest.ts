export interface getContestResponse {
  contests: ContestData[]
}

export interface ContestData {
  id: string, 
  name: string,
  startDate: Date | string,
  endDate: Date | string
}
