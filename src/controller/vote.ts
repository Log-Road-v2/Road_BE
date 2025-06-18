import express, { Request, Response } from 'express';
import vote from '../service/vote';
import { apiLimit } from '../middleware/limit';
import { AuthenticatedRequest } from '../types';

const app = express();

app.get('/:contestId', apiLimit, (req: AuthenticatedRequest, res: Response) => {
  vote.voteList(req, res);
});
// app.get('/myvote', apiLimit, (req: Request, res: Response) => {
//   vote.myVote(req, res);s
// });
// app.put('/', apiLimit, (req: Request, res: Response) => {
//   vote.vote(req, res);
// });

export default app;
