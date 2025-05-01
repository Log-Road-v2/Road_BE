import { signUp } from './auth/signup';
import { refresh } from './auth/token';
import { login } from './auth/login';
import { sendMail } from './auth/sendMail';
import { passwordModify } from './auth/passwordModify';

export default {
  signUp,
  refresh,
  login,
  sendMail,
  passwordModify
};
