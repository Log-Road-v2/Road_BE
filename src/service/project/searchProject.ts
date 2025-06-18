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
    const rawOffset = Number(req.query.offset);
    const offset = Number.isInteger(rawOffset) && rawOffset > 0 ? rawOffset : 1;
    const pageIndex = offset - 1;
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
          ...(userId && {
            _count: {
              select: { mark: { where: { userId } } }
            }
          })
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
      isMark: userId ? Boolean(project._count.mark) : null
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

