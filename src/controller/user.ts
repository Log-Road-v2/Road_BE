import express from 'express';
import user from '../service/user';
import { getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';

const app = express();

app.get('/', verifyJWT, getApiLimit, user.getUserInfoHandler)
app.get('/projects', verifyJWT, getApiLimit, user.getJoinedProjectsHandler)
app.get('/submissions', verifyJWT, getApiLimit, user.getWrittenProjectsHandler)
app.get('/mark', verifyJWT, getApiLimit, user.getBookmarkedProjectsHandler)

export default app