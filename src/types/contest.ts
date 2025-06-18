export interface getContestResponse {
  contests: ContestData[]
}

export interface ContestData {
  id: string, 
  name: string,
  startDate: string,
  endDate: string
}
