import express from 'express';
import auth from './auth';
import vote from "./vote"
import project from './project';
import user from './user';
import contest from './contest';

const app = express();

app.use('/auth', auth);
app.use('/vote', vote);
app.use('/project', project);
app.use('/user', user);
app.use('/contest', contest);

export default app;
