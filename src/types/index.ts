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

export interface AuthenticatedRequest<
  Params = Record<string, never>,
  ResBody = unknown,
  Body = Record<string, never>,
  Query = ParsedQs
> extends Request<Params, ResBody, Body, Query> {
  payload?: PayloadData;
  userId?: bigint;
}

export const REDIS_KEY = {
  ACCESS_TOKEN: 'access',
  REFRESH_TOKEN: 'refresh'
};
