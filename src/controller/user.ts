import express, { Response } from 'express';
import user from '../service/user';
import { apiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { AuthenticatedRequest } from '../types';

const router = express();

router.get('/', apiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  user.getUserInfo(req, res)
});

router.get('/projects', apiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  user.getJoinedProjects(req, res)
});

router.get('/submissions', apiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  user.getWrittenProjects(req, res)
});

router.get('/mark', apiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  user.getBookmarkedProjects(req, res)
});

export default router