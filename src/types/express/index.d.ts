import express from 'express';

export {};

declare global {
  namespace Express {
    export interface Request {
      payload?: PayloadData;
      userId?: bigint;
    }
  }
}

interface PayloadData {
  id: string;
  sub: string;
  type: 'access' | 'refresh';
  iat: number;
}
