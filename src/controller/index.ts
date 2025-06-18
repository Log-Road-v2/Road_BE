import express from 'express';
import auth from './auth';
import vote from "./vote"
import project from './project';

const app = express();

app.use('/auth', auth);
app.use('/vote', vote);
app.use('/project', project);

export default app;
