import { prisma } from '../../config/prisma';
import { Prisma, ProjectState } from '@prisma/client';
import { Response, Request, RequestHandler } from 'express';
import { BasicResponse } from '../../types';
import { SearchProjectResponse, ProjectResponse, SearchProjectQuery } from '../../types/project';
import { buildFileUrl } from '../../utils/buildFileUrl';

// 프로젝트 검색

const PAGE_SIZE = 10;

export const searchProjectHandler: RequestHandler<
  unknown,
  SearchProjectResponse | BasicResponse,
  unknown,
  SearchProjectQuery
> = async (req, res) => {
  await searchProject(req, res);
};

const searchProject = async (
  req: Request<unknown, SearchProjectResponse | BasicResponse, unknown, SearchProjectQuery>,
  res: Response<BasicResponse | SearchProjectResponse>
) => {
  try {
    const userId = req.userId ?? undefined;

    const keyword = (req.query.keyword ?? '').toString().trim();
    const rawOffset = Number(req.query.offset);
    const offset = Number.isInteger(rawOffset) && rawOffset > 0 ? rawOffset : 1;
    const skip = PAGE_SIZE * (offset - 1);

    const whereCondition: Prisma.ProjectWhereInput = keyword
      ? {
          projectName: {
            contains: keyword,
            mode: Prisma.QueryMode.insensitive
          },
          state: ProjectState.APPROVAL
        }
      : {
          state: ProjectState.APPROVAL
        };

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
        skip,
        take: PAGE_SIZE,
        orderBy: { projectName: 'asc' }
      }),

      prisma.project.count({ where: whereCondition })
    ]);

    const formattedProjects: ProjectResponse[] = projects.map((project) => ({
      id: project.id.toString(),
      projectName: project.projectName,
      authorCategory: project.authorCategory,
      introduction: project.introduction,
      image: buildFileUrl(project.image),
      isMark: userId ? Boolean(project._count?.mark) : null
    }));

    return res.status(200).json({
      offset,
      totalProject: totalProjectCount,
      projects: formattedProjects
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
