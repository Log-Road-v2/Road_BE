import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import redis from '../../config/redis';
import { checkEmailRegex } from '../../utils/regex';
import { generateToken } from './token';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: '올바르지 않은 입력값'
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
    if (!bcrypt.compareSync(password, thisUser.password)) {
      return res.status(409).json({
        message: '비밀번호 불일치'
      });
    }

    const accessToken = await generateToken(thisUser.id.toString(), true);
    const refreshToken = await generateToken(Date.now().toString(), false);

    await redis.set(thisUser.id.toString(), accessToken, 'EX', 7200);
    await redis.set(refreshToken, thisUser.id.toString(), 'EX', 604800);

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
