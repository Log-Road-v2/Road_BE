export interface ContestResponse {
  contests: ContestData[];
}

export interface ContestData {
  id: string;
  name: string;
  startDate: string | Date;
  endDate: string | Date;
}
