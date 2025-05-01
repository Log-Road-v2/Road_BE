import redis from '../../config/redis';
import { signJWT, verifyJWT } from '../../utils/jwt';
import { Request, Response } from 'express';

export const generateToken = async (id: string, isAccess: boolean) => {
  const token = signJWT({ id }, isAccess ? '2h' : '7d');
  return token;
};

export const refresh = async (req: Request, res: Response) => {
  const authorization = req.get('Authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(400).json({
      message: '확인할 수 없는 토큰'
    });
  }
  const token = authorization.split(' ')[1];
  const { payload, expired } = verifyJWT(token);

  if (!payload || expired) {
    return res.status(400).json({
      message: '만료되었거나 유효하지 않은 토큰'
    });
  }

  const value = await redis.get(token);
  if (!value) {
    return res.status(400).json({
      message: '만료된 토큰'
    });
  }

  const accessToken = await generateToken(value, true);
  await redis.set(value, accessToken, 'EX', 7200);

  return res.status(200).json({
    accessToken: accessToken,
    refreshToken: token
  });
};
