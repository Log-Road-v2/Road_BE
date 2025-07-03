import express, { Request, Response } from 'express';
import vote from '../service/vote';
import { getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';

const app = express();
app.use(express.json());

app.get('/:contestId', verifyJWT, getApiLimit, vote.voteListHandler);
app.get('/myvote/:contestId', verifyJWT, getApiLimit, vote.myVoteHandler);
app.put('/:contestId', verifyJWT, getApiLimit, vote.voteHandler);

export default app;
