import { prisma } from '../../config/prisma';
import { Response } from 'express';
import { AuthenticatedRequest, BasicResponse } from '../../types';
import { GetBookmarkedProjectsResponse, ProjectResponse } from '../../types/user';

const PAGE_SIZE = 10;

export const getBookmarkedProjects = async (
  req: AuthenticatedRequest,
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

    const [markedProjects, totalProjects] = await prisma.$transaction([
      prisma.mark.findMany({
        where: { userId },
        skip,
        take: PAGE_SIZE,
        orderBy: [{ id: 'asc' }],
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
      prisma.mark.count({
        where: { userId },
      }),
    ]);

    const projects: ProjectResponse[] = markedProjects.map(({ project }) => ({
      id: project.id.toString(),
      projectName: project.projectName,
      introduction: project.introduction ?? '',
      authorCategory: project.authorCategory,
      image: project.image ?? '',
      isMark: true,
    }));

    return res.status(200).json({
      offset: offsetNumber,
      totalProjects,
      projects,
    });

  } catch (error) {
    console.error('getBookmarkedProjects Error:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
