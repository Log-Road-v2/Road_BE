import jwt, { SignOptions } from 'jsonwebtoken';
import ms from 'ms';

export const signJWT = (payload: object, expiresIn: ms.StringValue | number): string => {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('private key is not defined');
  }
  const signOptions: SignOptions = {
    algorithm: 'RS256',
    expiresIn: expiresIn
  };
  return jwt.sign(payload, privateKey, signOptions);
};

export const verifyJWT = (token: string) => {
  try {
    const publicKey = process.env.PUBLIC_KEY || '';
    const decoded = jwt.verify(token, publicKey);
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
