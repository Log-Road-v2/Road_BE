import redis from '../../config/redis';
import { Request, RequestHandler, Response } from 'express';
import { createTransport } from 'nodemailer';
import { SendMailRequest } from '../../types/auth';
import { BasicResponse } from '../../types';
import crypto from 'crypto';

const EMAIL_ID = process.env.EMAIL_ID;
const EMAIL_PW = process.env.EMAIL_PW;
if (!EMAIL_ID || !EMAIL_PW) {
  throw Error('email id or email pw get failed from env');
}

export const sendMailHandler: RequestHandler<unknown, BasicResponse, SendMailRequest> = async (req, res) => {
  await sendMail(req, res);
};

const sendMail = async (req: Request<unknown, BasicResponse, SendMailRequest>, res: Response<BasicResponse>) => {
  const { email } = req.body;

  const transport = createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_ID,
      pass: EMAIL_PW
    }
  });

  try {
    const random = crypto.randomBytes(4).toString('hex').slice(8).padStart(8, '0');

    await transport.sendMail({
      from: EMAIL_ID,
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
