import express from 'express';
import user from '../service/user';
import { getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';

const app = express.Router();

app.get('/', getApiLimit, verifyJWT, user.getUserInfoHandler);
app.get('/projects', getApiLimit, verifyJWT, user.getJoinedProjectsHandler);
app.get('/submissions', getApiLimit, verifyJWT, user.getWrittenProjectsHandler);
app.get('/mark', getApiLimit, verifyJWT, user.getBookmarkedProjectsHandler);

export default app;
