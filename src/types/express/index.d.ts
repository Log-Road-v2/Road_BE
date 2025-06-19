import express from 'express';
import { PayloadData } from '..';

export {};

declare global {
  namespace Express {
    export interface Request {
      payload?: PayloadData;
      userId?: bigint;
    }
  }
}
