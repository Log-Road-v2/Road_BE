import express from 'express';
import vote from '../service/vote';
import { getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';

const app = express.Router();

app.get('/myvote/:contestId', verifyJWT, getApiLimit, vote.myVoteHandler);
app.get('/:contestId', verifyJWT, getApiLimit, vote.voteListHandler);
app.put('/:contestId', verifyJWT, getApiLimit, vote.voteHandler);

export default app;
