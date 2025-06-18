import express from 'express';
import auth from './auth';
import vote from "./vote"
import project from './project';
import user from './user';

const app = express();

app.use('/auth', auth);
app.use('/vote', vote);
app.use('/project', project);
app.use('/user', user);

export default app;
