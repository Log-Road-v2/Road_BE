import { Role, prisma } from '../../config/prisma';
import { Response, Request, RequestHandler } from 'express';
import { BasicResponse } from '../../types';
import { GetStudentInfoResponse, GetTeacherInfoResponse } from '../../types/user';

export const getUserInfoHandler: RequestHandler<
  unknown,
  BasicResponse | GetStudentInfoResponse | GetTeacherInfoResponse
> = async (req, res) => {
  await getUserInfo(req, res);
};

const getUserInfo = async (
  req: Request<unknown, BasicResponse | GetStudentInfoResponse | GetTeacherInfoResponse>,
  res: Response<BasicResponse | GetStudentInfoResponse | GetTeacherInfoResponse>
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
    }

    const userId = BigInt(req.userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        name: true,
        email: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const baseResponse = {
      role: user.role,
      name: user.name,
      email: user.email
    };

    switch (user.role) {
      case Role.TEACHER:
      case Role.ADMIN:
        return res.status(200).json(baseResponse);

      case Role.STUDENT: {
        const student = await prisma.student.findUnique({
          where: { userId },
          select: {
            grade: true,
            classNumber: true,
            studentNumber: true
          }
        });

        if (!student) {
          return res.status(404).json({ message: '학생 정보를 찾을 수 없습니다.' });
        }

        return res.status(200).json({
          ...baseResponse,
          grade: student.grade,
          classNumber: student.classNumber,
          studentNumber: student.studentNumber
        });
      }

      default:
        return res.status(400).json({ message: '알 수 없는 사용자 역할입니다.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
