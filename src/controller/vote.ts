import express from 'express';
import vote from '../service/vote';
import { getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { validateContestId } from '../middleware/validation';

const app = express.Router();

app.get('/myvote/:contestId', getApiLimit, verifyJWT, vote.myVoteHandler);
app.get('/:contestId', getApiLimit, verifyJWT, vote.voteListHandler);
app.put('/:contestId', getApiLimit, verifyJWT, vote.voteHandler);

export default app;
