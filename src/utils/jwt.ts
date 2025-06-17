import jwt, { SignOptions } from 'jsonwebtoken';
import ms from 'ms';

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  throw Error('secret key get fail from env');
}

const signJWT = (payload: object, expiresIn: ms.StringValue | number): string => {
  const signOptions: SignOptions = {
    algorithm: 'HS256',
    expiresIn: expiresIn
  };
  return jwt.sign(payload, SECRET_KEY, signOptions);
};

export const generateToken = (id: string, sub: string, isAccess: boolean): string => {
  const token = signJWT(
    {
      id,
      sub,
      type: isAccess ? 'access' : 'refresh',
      iat: Math.floor(Date.now() / 1000)
    },
    isAccess ? '2h' : '7d'
  );
  return token;
};
