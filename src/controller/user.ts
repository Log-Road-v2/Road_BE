import express, { Response } from 'express';
import user from '../service/user';
import { apiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { AuthenticatedRequest } from '../types';

const app = express();

app.get('/', apiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  user.getUserInfo(req, res)
});

app.get('/projects', apiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  user.getJoinedProjects(req, res)
});

app.get('/submissions', apiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  user.getWrittenProjects(req, res)
});

app.get('/mark', apiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  user.getBookmarkedProjects(req, res)
});

export default app