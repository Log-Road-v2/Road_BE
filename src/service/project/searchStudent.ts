import { prisma } from "../../config/prisma";
import { Response } from "express";
import { AuthenticatedRequest, BasicResponse } from "../../types";
import { SearchStudentResponse, StudentDetail } from "../../types/project";

// 학생 검색
export const searchStudent = async (
  req: AuthenticatedRequest,
  res: Response<BasicResponse | SearchStudentResponse>
) => {
  try {
    const keyword = (req.query.keyword as string)?.trim();
    if (!keyword) {
      return res.status(400).json({ message: "검색어가 유효하지 않습니다." });
    }

    const keywordNum = Number(keyword);
    const isKeywordNum = !isNaN(keywordNum);

    const where = {
      OR: [
        { name: { contains: keyword } },
        ...(isKeywordNum
          ? [
              { grade: keywordNum },
              { classNumber: keywordNum },
              { studentNumber: keywordNum },
            ]
          : []),
      ],
    };

    const students = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        grade: true,
        classNumber: true,
        studentNumber: true,
      },
      where,
      orderBy: [
        { grade: "asc" },
        { classNumber: "asc" },
        { studentNumber: "asc" },
        { name: "asc" },
      ],
    });

    const result: StudentDetail[] = students.map((student) => ({
      studentId: student.id.toString(),
      name: student.name,
      grade: student.grade,
      classNumber: student.classNumber,
      studentNumber: student.studentNumber,
    }));

    return res.status(200).json({ students: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};
