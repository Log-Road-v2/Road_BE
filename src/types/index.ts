import { Request } from 'express';
import { ParsedQs } from 'qs';

export interface BasicResponse {
  message: string;
}

export interface PayloadData {
  id: string;
  sub: string;
  type: 'access' | 'refresh';
  iat: number;
}

export interface AuthenticatedRequest<Params = Record<string, never>, Query = ParsedQs, Body = Record<string, never>>
  extends Request<Params, any, Body, Query> {
  payload?: PayloadData;
  userId?: Number;
}

export const REDIS_KEY = {
  ACCESS_TOKEN: 'access',
  REFRESH_TOKEN: 'refresh'
};
