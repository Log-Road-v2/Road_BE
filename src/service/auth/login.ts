import { prisma } from '../../config/prisma';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import redis from '../../config/redis';
import { checkEmailRegex } from '../../utils/regex';
import { LoginRequest, LoginResponse } from '../../types/auth';
import { BasicResponse, REDIS_KEY } from '../../types';
import { generateToken } from '../../utils/jwt';
import crypto from 'crypto';

export const login = async (req: Request<{}, {}, LoginRequest>, res: Response<LoginResponse | BasicResponse>) => {
  const accessTokenExpirySecond = Number(process.env.ACCESS_TOKEN_EXPIRY_SECOND) || 7200;
  const refreshTokenExpirySecond = Number(process.env.REFRESH_TOKEN_EXPIRY_SECOND) || 604800;

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: '올바르지 않은 입력 값'
    });
  }
  if (!checkEmailRegex(email)) {
    return res.status(400).json({
      message: '올바르지 않은 이메일'
    });
  }

  try {
    const thisUser = await prisma.user.findUnique({ where: { email } });
    if (!thisUser) {
      return res.status(404).json({
        message: '존재하지 않는 이메일'
      });
    }
    if (!(await bcrypt.compare(password, thisUser.password))) {
      return res.status(409).json({
        message: '비밀번호 불일치'
      });
    }

    const accessToken = generateToken(thisUser.id.toString(), crypto.randomUUID(), true);
    const refreshToken = generateToken(crypto.randomUUID(), thisUser.id.toString(), false);

    await redis.set(`${REDIS_KEY.ACCESS_TOKEN} ${thisUser.id}`, accessToken, 'EX', accessTokenExpirySecond);
    await redis.set(`${REDIS_KEY.REFRESH_TOKEN} ${thisUser.id}`, refreshToken, 'EX', refreshTokenExpirySecond);

    return res.status(200).json({
      role: thisUser.role,
      accessToken: accessToken,
      refreshToken: refreshToken
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
