import redis from '../../config/redis';
import { AuthenticatedRequest, BasicRespone, REDIS_KEY } from '../../types';
import { TokenResponse } from '../../types/auth';
import { Response } from 'express';
import { generateToken } from '../../utils/jwt';
import crypto from 'crypto';

export const refresh = async (req: AuthenticatedRequest, res: Response<TokenResponse | BasicRespone>) => {
  const accessTokenExpirySecond = Number(process.env.ACCESS_TOKEN_EXPIRY_SECOND) || 7200;

  try {
    const payload = req.payload;
    if (!payload || payload.type !== 'refresh') {
      return res.status(400).json({
        message: '토큰 검증 실패'
      });
    }

    const authorization = req.get('Authorization');
    if (!authorization) {
      return res.status(400).json({
        message: '확인할 수 없는 토큰'
      });
    }
    const token = authorization.split(' ')[1];

    const userId = payload.sub;
    if (!userId) {
      return res.status(400).json({
        message: '만료되었거나 사용할 수 없는 토큰'
      });
    }

    const refreshToken = await redis.get(`${REDIS_KEY.REFRESH_TOKEN} ${userId}`);
    if (!refreshToken || refreshToken !== token) {
      return res.status(400).json({
        message: '만료되었거나 일치하지 않는 토큰'
      });
    }

    const accessToken = generateToken(userId, crypto.randomUUID(), true);
    await redis.set(`${REDIS_KEY.ACCESS_TOKEN} ${userId}`, accessToken, 'EX', accessTokenExpirySecond);

    return res.status(200).json({
      accessToken: accessToken,
      refreshToken: token
    });
  } catch (err) {
    return res.status(500).json({
      message: '서버 에러 발생생'
    });
  }
};
