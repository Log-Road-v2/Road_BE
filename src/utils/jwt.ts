import jwt, { SignOptions } from 'jsonwebtoken';
import ms from 'ms';

export const signJWT = (payload: object, expiresIn: ms.StringValue | number): string => {
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
