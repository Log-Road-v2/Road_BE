import { signUpHandler } from './auth/signup';
import { refreshHandler } from './auth/refresh';
import { loginHandler } from './auth/login';
import { sendMailHandler } from './auth/sendMail';
import { passwordModifyHandler } from './auth/passwordModify';
import { logoutHandler } from './auth/logout';

export default {
  signUpHandler,
  refreshHandler,
  loginHandler,
  sendMailHandler,
  passwordModifyHandler,
  logoutHandler
};
