import { prisma } from "../../config/prisma";
import { Prisma } from '@prisma/client';
import { Response } from "express";
import { AuthenticatedRequest, BasicResponse } from "../../types";
import { SearchProjectResponse, ProjectResponse } from "../../types/project"

// 프로젝트 검색

const PAGE_SIZE = 10

export const searchProject = async (
  req: AuthenticatedRequest,
  res: Response<BasicResponse | SearchProjectResponse>
) => {
  try {
    const userId = req.userId ?? undefined;
    const keywordRaw = req.query.keyword;
    const keyword = typeof keywordRaw === 'string' ? keywordRaw.trim() : '';   
    const offset = Number(req.query.offset) || 1;
    const pageIndex = Math.max((isNaN(offset) ? 1 : offset) - 1, 0);
    const skipAmount = PAGE_SIZE * pageIndex;

    const whereCondition: Prisma.ProjectWhereInput = keyword
    ? {
        projectName: {
          contains: keyword,
          mode: Prisma.QueryMode.insensitive,
        },
      }
    : {};

    const [projects, totalProjectCount] = await prisma.$transaction([
      prisma.project.findMany({
        select: {
          id: true,
          projectName: true,
          authorCategory: true,
          introduction: true,
          image: true,
          ...(userId && {mark: {
            where: { userId },
            select: { id: true },
            take: 1,
          }}),
        },
        where: whereCondition,
        skip: skipAmount,
        take: PAGE_SIZE,
        orderBy: { projectName: 'asc' }
      }),

      prisma.project.count({
        where: whereCondition
      })
    ])

    const formattedProjects: ProjectResponse[] = projects.map((project) => ({
      id: project.id.toString(),
      projectName: project.projectName,
      authorCategory: project.authorCategory,
      introduction: project.introduction,
      image: project.image,
      isMark: userId ? (project.mark && project.mark.length > 0 ? true : false) : null
    }))

    return res.status(200).json({
      offset,
      totalProject: totalProjectCount,
      projects: formattedProjects
    })

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    })
  }
}

