import express, { Request, Response } from 'express'
import contest from '../service/contest'
import { getApiLimit } from '../middleware/limit'
import { AuthenticatedRequest } from '../types';

const router = express.Router(); 

router.get('/', getApiLimit, (req: AuthenticatedRequest, res: Response) => {
  contest.getContestList(req, res)
})

router.get('/present', getApiLimit, (req: AuthenticatedRequest, res: Response) => {
  contest.getOngoingContests(req, res)
})

export default router