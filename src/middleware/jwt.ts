import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, PayloadData } from '../types';

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  throw Error('secret key get fail from env');
}

export const verifyJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authorization = req.get('Authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      res.status(401).json({
        message: '토큰 유효성 검사 실패'
      });
      return;
    }
    const token = authorization.split(' ')[1];

    const decoded = jwt.verify(token, SECRET_KEY) as PayloadData;
    if (!decoded.id || !decoded.sub || !decoded.type || !decoded.iat) {
      res.status(401).json({
        message: '유효하지 않은 토큰 페이로드'
      });
      return;
    }
    req.payload = decoded;

    if (decoded.type === 'access') {
      try {
        const userId = BigInt(decoded.id);
        req.userId = userId;
      } catch (err) {
        res.status(400).json({
          message: '유효하지 않은 사용자 ID'
        });
        return;
      }
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: '토큰 검증 오류 발생'
    });
  }
};
