export interface BasicResponse {
  message: string;
}

export interface PayloadData {
  id: string;
  sub: string;
  type: 'access' | 'refresh';
  iat: number;
}

export const REDIS_KEY = {
  ACCESS_TOKEN: 'access',
  REFRESH_TOKEN: 'refresh'
};
