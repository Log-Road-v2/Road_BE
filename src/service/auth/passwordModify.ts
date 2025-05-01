import { prisma } from '../../config/prisma';
import bcrypt from 'bcrypt';
import redis from '../../config/redis';
import { Request, Response } from 'express';

export const passwordModify = async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;
    const mailCode = await redis.get(email);

    if (!mailCode) {
      return res.status(400).json({
        message: '코드 조회 실패'
      });
    }
    if (mailCode !== code) {
      return res.status(400).json({
        message: '코드 불일치'
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashed }
    });

    return res.status(200).json({
      message: '비밀번호 변경 성공'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
