import jwt, { SignOptions } from 'jsonwebtoken';
import ms from 'ms';

const signJWT = (payload: object, expiresIn: ms.StringValue | number): string => {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('private key is not defined');
  }
  const signOptions: SignOptions = {
    algorithm: 'HS256',
    expiresIn: expiresIn
  };
  return jwt.sign(payload, privateKey, signOptions);
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
