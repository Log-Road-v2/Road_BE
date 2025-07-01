import { prisma } from '../../config/prisma';
import { RequestHandler, Response, Request } from 'express';
import { BasicResponse } from '../../types';
import { GetBookmarkedProjectsResponse, ProjectResponse, OffsetQuery } from '../../types/user';

const PAGE_SIZE = 10;

export const getBookmarkedProjectsHandler: RequestHandler <unknown, BasicResponse | GetBookmarkedProjectsResponse, unknown, OffsetQuery> = (req, res) => {
  getBookmarkedProjects(req, res);
}

const getBookmarkedProjects = async (
  req: Request<unknown, BasicResponse | GetBookmarkedProjectsResponse, unknown, OffsetQuery>,
  res: Response<BasicResponse | GetBookmarkedProjectsResponse>
) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
    }

    const rawOffset = req.query.offset;
    const offsetNumber = Math.max(Number(rawOffset ?? 1), 1);
    const skip = PAGE_SIZE * (offsetNumber - 1);

    const [marks, total] = await prisma.$transaction([
      prisma.mark.findMany({
        where: { userId },
        skip,
        take: PAGE_SIZE,
        orderBy: { id: 'asc' },
        select: {
          project: {
            select: {
              id: true,
              projectName: true,
              introduction: true,
              authorCategory: true,
              image: true,
            },
          },
        },
      }),
      prisma.mark.count({ where: { userId } }),
    ]);

    const projects: ProjectResponse[] = marks.map(({ project }) => ({
      id: project.id.toString(),
      projectName: project.projectName,
      introduction: project.introduction ?? '',
      authorCategory: project.authorCategory,
      image: project.image ?? '',
      isMark: true,
    }));

    return res.status(200).json({
      offset: offsetNumber,
      totalProjects: total,
      projects,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
