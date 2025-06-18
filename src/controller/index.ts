import express from 'express';
import auth from './auth';
import project from './project';

const app = express();

app.use('/auth', auth);
app.use('/project', project);

export default app;
