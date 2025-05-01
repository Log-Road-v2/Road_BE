import redis from '../../config/redis';
import { Request, Response } from 'express';
import { createTransport } from 'nodemailer';

export const sendMail = async (req: Request, res: Response) => {
  const emailId = process.env.EMAIL_ID;
  const emailPw = process.env.EMAIL_PW;

  const { email } = req.body;

  const transport = createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: emailId,
      pass: emailPw
    }
  });

  try {
    const random = Math.random().toString(36).slice(2, 10);

    await transport.sendMail({
      from: emailId,
      to: email,
      subject: 'Road 임시 비밀번호',
      text: `임시 비밀번호는 ${random}`
    });

    await redis.set(email, random, 'EX', 600);

    return res.status(200).json({
      message: '메일이 발송되었습니다'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
