import { Response } from 'express';
import redis from '../../config/redis';
import { AuthenticatedRequest, BasicRespone, REDIS_KEY } from '../../types';

export const logout = async (req: AuthenticatedRequest, res: Response<BasicRespone>) => {
  try {
    const payload = req.payload;
    if (!payload || payload.type !== 'access') {
      return res.status(400).json({
        message: '토큰 검증 실패'
      });
    }

    const userId = payload.id;

    await redis.del(`${REDIS_KEY.ACCESS_TOKEN} ${userId}`);
    await redis.del(`${REDIS_KEY.REFRESH_TOKEN} ${userId}`);

    return res.status(200).json({
      message: '로그아웃 완료'
    });
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      message: '로그아웃 실패'
    });
  }
};
