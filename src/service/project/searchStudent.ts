import { prisma } from "../../config/prisma";
import { RequestHandler, Response, Request } from "express";
import { BasicResponse } from "../../types";
import { SearchStudentResponse, StudentDetail, SearchKeywordQuery } from "../../types/project";

// 학생 검색

export const searchStudentHandler: RequestHandler<
  unknown,
  SearchStudentResponse | BasicResponse,
  unknown,
  SearchKeywordQuery
  > = (req, res) => {
  searchStudent(req, res);
};

const searchStudent = async (
  req: Request<unknown, SearchStudentResponse | BasicResponse, unknown, SearchKeywordQuery>,
  res: Response<BasicResponse | SearchStudentResponse>
) => {
  try {
    const keyword = getTrimmedKeyword(req.query.keyword);
    if (!keyword) {
      return res.status(400).json({ message: "검색어가 유효하지 않습니다." });
    }

    const where = buildStudentSearchWhere(keyword);
    const students = await fetchStudents(where);

    const result: StudentDetail[] = students.map(student => ({
      studentId: student.id.toString(),
      name: student.name,
      grade: student.grade ?? null,
      classNumber: student.classNumber ?? null,
      studentNumber: student.studentNumber ?? null,
    }));

    return res.status(200).json({ students: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};

function getTrimmedKeyword(queryKeyword: unknown): string | null {
  if (typeof queryKeyword !== "string") return null;
  const trimmed = queryKeyword.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function buildStudentSearchWhere(keyword: string) {
  const keywords = keyword.split(/\s+/).filter(Boolean);
  const keywordNum = keywords.map(k => Number(k)).filter(n => !isNaN(n));

  return {
    AND: keywords.map(k => ({
      OR: [
        { name: { contains: k, mode: "insensitive" } },
        ...(keywordNum.includes(Number(k))
          ? [
              { grade: Number(k) },
              { classNumber: Number(k) },
              { studentNumber: Number(k) },
            ]
          : []),
      ],
    })),
  };
}

async function fetchStudents(where: object) {
  return await prisma.student.findMany({
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
    take: 15,
  });
}