import express from 'express'
import contest from '../service/contest'
import { getApiLimit } from '../middleware/limit';

const app = express.Router(); 

app.get('/', getApiLimit, contest.getContestList)
app.get('/present', getApiLimit, contest.getOngoingContests)

export default app