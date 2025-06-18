import { prisma } from '../../config/prisma';
import { Request, RequestHandler, Response } from 'express';
import bcrypt from 'bcrypt';
import { checkEmailRegex, checkPasswordRegex } from '../../utils/regex';
import { SignResponse, SignUpRequest } from '../../types/auth';
import { generateToken } from '../../utils/jwt';
import { BasicResponse, REDIS_KEY } from '../../types';
import crypto from 'crypto';
import redis from '../../config/redis';

const accessTokenExpirySecond = Number(process.env.ACCESS_TOKEN_EXPIRY_SECOND) || 7200;
const refreshTokenExpirySecond = Number(process.env.REFRESH_TOKEN_EXPIRY_SECOND) || 604800;

export const signUpHandler: RequestHandler<unknown, SignResponse | BasicResponse, SignUpRequest> = async (req, res) => {
  signUp(req, res);
};

const signUp = async (
  req: Request<unknown, SignResponse | BasicResponse, SignUpRequest>,
  res: Response<SignResponse | BasicResponse>
) => {
  const { email, code, password, grade, classNumber, studentNumber, name } = req.body;

  const isStudent = grade && classNumber && studentNumber;

  if (!email || !code || !password || !name) {
    return res.status(400).json({
      message: '올바르지 않은 입력값'
    });
  }
  if (!checkEmailRegex(email)) {
    return res.status(400).json({
      message: '올바르지 않은 이메일'
    });
  }
  if (!checkPasswordRegex(password)) {
    return res.status(400).json({
      message: '올바르지 않은 비밀번호'
    });
  }
  if (isStudent) {
    if (!grade || grade < 1 || grade > 3) {
      return res.status(400).json({
        message: '올바르지 않은 학년'
      });
    }
    if (!classNumber || classNumber < 1 || classNumber > 4) {
      return res.status(400).json({
        message: '올바르지 않은 반'
      });
    }
    if (!studentNumber || studentNumber < 1 || studentNumber > 20) {
      return res.status(400).json({
        message: '올바르지 않은 번호'
      });
    }
  }

  try {
    const mailCode = await redis.get(email);
    if (mailCode !== code) {
      return res.status(409).json({
        message: '인증코드 불일치'
      });
    }
    const existMail = await prisma.user.findUnique({ where: { email: email } });
    if (existMail) {
      return res.status(409).json({
        message: '이미 가입된 이메일'
      });
    }
    let existStudent = null;
    if (isStudent) {
      existStudent = await prisma.student.findFirst({ where: { grade, classNumber, studentNumber } });
      if (!existStudent) {
        return res.status(400).json({
          message: '존재하지 않는 학번'
        });
      }
      if (existStudent.userId) {
        return res.status(409).json({
          message: '이미 가입된 학번'
        });
      }
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (tx: any) => {
      const createdUser = await tx.user.create({
        data: {
          email: email,
          password: hash,
          name: name
        }
      });

      if (isStudent) {
        await tx.student.update({
          where: { id: existStudent?.id },
          data: { userId: createdUser.id }
        });
      }

      return createdUser;
    });

    if (!user) {
      return res.status(500).json({
        message: '회원 생성 실패'
      });
    }

    const accessToken = generateToken(user.id.toString(), crypto.randomUUID(), true);
    const refreshToken = generateToken(crypto.randomUUID(), user.id.toString(), false);

    await redis.set(`${REDIS_KEY.ACCESS_TOKEN} ${user.id}`, accessToken, 'EX', accessTokenExpirySecond);
    await redis.set(`${REDIS_KEY.REFRESH_TOKEN} ${user.id}`, refreshToken, 'EX', refreshTokenExpirySecond);

    return res.status(201).json({
      role: user.role,
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
