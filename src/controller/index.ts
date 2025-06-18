import express from 'express';
import auth from './auth';
import vote from "./vote"

const app = express();

app.use('/auth', auth);
app.use('/vote', vote);

export default app;
