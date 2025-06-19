import { Request, RequestHandler, Response } from 'express';
import redis from '../../config/redis';
import { BasicResponse, REDIS_KEY } from '../../types';

export const logoutHandler: RequestHandler = async (req, res) => {
  logout(req, res);
};

const logout = async (req: Request, res: Response<BasicResponse>) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: '토큰 검증 실패'
      });
    }

    await redis.del(`${REDIS_KEY.ACCESS_TOKEN} ${userId}`, `${REDIS_KEY.REFRESH_TOKEN} ${userId}`);

    return res.status(200).json({
      message: '로그아웃 완료'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
