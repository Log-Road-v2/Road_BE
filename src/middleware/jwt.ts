import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, PayloadData } from '../types';

export const verifyJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      res.status(500).json({
        message: 'private key is not defined'
      });
      return;
    }
    const authorization = req.get('Authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      res.status(401).json({
        message: '토큰 유효성 검사 실패'
      });
      return;
    }
    const token = authorization.split(' ')[1];

    const decoded = jwt.verify(token, privateKey) as PayloadData;
    if (!decoded.id || !decoded.sub || !decoded.type || !decoded.iat) {
      res.status(401).json({
        message: '유효하지 않은 토큰 페이로드'
      });
      return;
    }
    req.payload = decoded;

    if (decoded.type === 'access') {
      const userId = Number(decoded.id);
      if (isNaN(userId)) {
        res.status(400).json({
          message: '토큰 검증 실패'
        });
        return;
      }
      req.userId = userId;
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: '토큰 검증 오류 발생'
    });
  }
};
