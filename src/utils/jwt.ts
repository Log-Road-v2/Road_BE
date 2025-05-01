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

export const verifyJWT = (token: string) => {
  try {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      return {
        payload: null,
        expired: 'private key is not defined'
      };
    }
    const decoded = jwt.verify(token, privateKey);
    return {
      payload: decoded,
      expired: false
    };
  } catch (err: any) {
    console.error(err);
    return {
      payload: null,
      expired: err.message.includes('jwt expired')
    };
  }
};
