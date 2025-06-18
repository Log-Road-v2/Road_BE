import express from 'express';
import auth from './auth';
<<<<<<< feature/#17-Project
import project from './project';
=======
import user from './user';
>>>>>>> develope

const app = express();

app.use('/auth', auth);
<<<<<<< feature/#17-Project
app.use('/project', project);
=======
app.use('/user', user);
>>>>>>> develope

export default app;
