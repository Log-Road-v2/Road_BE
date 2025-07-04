import { Response, Request, RequestHandler } from 'express';
import { prisma } from '../../config/prisma';
import { BasicResponse } from '../../types';
import { GetProjectResponse } from '../../types/user';
import { ProjectState } from '@prisma/client';
import { buildFileUrl } from '../../utils/buildFileUrl';

type Query = { state?: ProjectState | 'ALL' };

const VALID_STATES: (ProjectState | 'ALL')[] = ['ALL', 'PENDING', 'APPROVAL', 'REJECTED', 'MODIFY', 'WRITING'];

export const getWrittenProjectsHandler: RequestHandler<
  unknown,
  BasicResponse | GetProjectResponse,
  unknown,
  { state?: ProjectState | 'ALL' }
> = async (req, res) => {
  await getWrittenProjects(req, res);
};

export const getWrittenProjects = async (
  req: Request<unknown, BasicResponse | GetProjectResponse, unknown, Query>,
  res: Response<BasicResponse | GetProjectResponse>
) => {
  try {
    if (!req.userId) {
      return res.status(400).json({ message: '토큰 검증 실패' });
    }

    const userId = req.userId;

    const rawState = req.query.state?.trim().toUpperCase() || 'ALL';

    if (!VALID_STATES.includes(rawState as ProjectState | 'ALL')) {
      return res.status(400).json({ message: '잘못된 프로젝트 상태입니다.' });
    }

    const isAll = rawState === 'ALL';

    const projects = await prisma.project.findMany({
      where: {
        writerId: userId,
        ...(isAll ? {} : { state: rawState as ProjectState })
      },
      select: {
        id: true,
        projectName: true,
        introduction: true,
        authorCategory: true,
        image: true
      },
      orderBy: { projectName: 'asc' }
    });

    const formattedProjects = projects.map((project) => ({
      ...project,
      id: project.id.toString(),
      image: buildFileUrl(project.image)
    }));

    return res.status(200).json({ projects: formattedProjects });
  } catch (err) {
    console.error('getWrittenProjects error:', err);
    return res.status(500).json({ message: '서버 오류 발생' });
  }
};
