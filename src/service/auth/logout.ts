import { Request, Response } from 'express';
import redis from '../../config/redis';
import jwt from 'jsonwebtoken';

export const logout = async (req: Request, res: Response) => {
  try {
    const authorization = req.get('Authorization');
    if (!authorization) {
      return res.status(400).json({
        message: '확인할 수 없는 토큰'
      });
    }
    const token = authorization.split(' ')[1];
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      return res.status(400).json({
        message: 'private key is not defined'
      });
    }

    const decoded = jwt.verify(token, privateKey) as { id: string };
    const userId = decoded.id;
    const keys = await redis.keys('refresh *');
    for (const key of keys) {
      const storedUserId = await redis.get(key);
      if (storedUserId === userId) {
        await redis.del(key);
        break;
      }
    }
    await redis.del(userId);

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
