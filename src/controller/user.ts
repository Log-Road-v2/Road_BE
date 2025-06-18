import express, { Response } from 'express';
import user from '../service/user';
import { getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { AuthenticatedRequest } from '../types';

const router = express();

router.get('/', getApiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  user.getUserInfo(req, res)
});

router.get('/projects', getApiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  user.getJoinedProjects(req, res)
});

router.get('/submissions', getApiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  user.getWrittenProjects(req, res)
});

router.get('/mark', getApiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  user.getBookmarkedProjects(req, res)
});

export default router