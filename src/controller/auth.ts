import express from 'express';
import auth from '../service/auth';
import { apiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';

const app = express.Router();

app.post('/signup', apiLimit, auth.signUpHandler);
app.post('/login', apiLimit, auth.loginHandler);
app.post('/refresh', apiLimit, verifyJWT, auth.refreshHandler);
app.post('/email', apiLimit, auth.sendMailHandler);
app.patch('/password', apiLimit, auth.passwordModifyHandler);
app.post('/logout', apiLimit, verifyJWT, auth.logoutHandler);

export default app;
