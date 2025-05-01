import { prisma, Role } from '../../config/prisma';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { checkEmailRegex, checkPasswordRegex } from '../../utils/regex';

export const signUp = async (req: Request, res: Response) => {
  const { role, email, password, grade, classNumber, studentNumber, name } = req.body;

  if (!role || !email || !password || !name) {
    return res.status(400).json({
      message: '올바르지 않은 입력값'
    });
  }
  if (role === Role.ADMIN) {
    return res.status(400).json({
      message: '올바르지 않은 역할'
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
  if (role === Role.STUDENT) {
    const gradeNum = Number(grade);
    const classNum = Number(classNumber);
    const studentNum = Number(studentNumber);
    if (gradeNum < 1 || gradeNum > 3) {
      return res.status(400).json({
        message: '올바르지 않은 학년'
      });
    }
    if (classNum < 1 || classNum > 4) {
      return res.status(400).json({
        message: '올바르지 않은 반'
      });
    }
    if (studentNum < 1 || studentNum > 20) {
      return res.status(400).json({
        message: '올바르지 않은 번호'
      });
    }
  }

  try {
    const existMail = await prisma.user.findUnique({ where: { email: email } });
    if (existMail) {
      return res.status(409).json({
        message: '이미 가입된 이메일'
      });
    }
    let existStudent = null;
    if (role === Role.STUDENT) {
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

    const hash = bcrypt.hashSync(password, 10);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email,
          password: hash,
          name: name,
          role: role
        }
      });

      if (role === Role.STUDENT) {
        await tx.student.update({
          where: { id: existStudent?.id },
          data: { userId: user.id }
        });
      }
    });

    return res.status(201).json({
      message: '회원가입 성공'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
