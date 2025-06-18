import { prisma } from "../../config/prisma";
import { Response } from "express";
import { AuthenticatedRequest, BasicResponse } from "../../types";
import { GetProjectResponse } from "../../types/user";

export const getJoinedProjects = async (
  req: AuthenticatedRequest,
  res: Response<BasicResponse | GetProjectResponse>
) => {
  try {
    const userId = req.userId
    if (!userId) {
      return res.status(400).json({
        message: '토큰 검증 실패'
      })
    }

    const projects = await prisma.project.findMany({
      select: {
        id: true,
        projectName: true,
        introduction: true,
        authorCategory: true,
        image: true
      },
      where: {
        OR: [
          { writerId: userId },
          { member: { some: { studentId: userId } } }
        ]
      },
      orderBy: { projectName: 'asc' }
    })

    const mappedProjects = projects.map((project) => ({
      ...project,
      id: project.id.toString(),
    }))
    
    return res.status(200).json({
      projects: mappedProjects,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "서버 오류 발생"
    });
  }
};
