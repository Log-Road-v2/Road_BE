import { signUp } from './auth/signup';
import { refresh } from './auth/refresh';
import { login } from './auth/login';
import { sendMail } from './auth/sendMail';
import { passwordModify } from './auth/passwordModify';
import { logout } from './auth/logout';

export default {
  signUp,
  refresh,
  login,
  sendMail,
  passwordModify,
  logout
};
