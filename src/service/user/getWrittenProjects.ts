import { Response } from 'express';
import { AuthenticatedRequest, BasicResponse } from "../../types";
import { GetProjectResponse, ProjectState } from "../../types/user";
import { prisma } from '../../config/prisma';

const VALID_PROJECT_STATES: Exclude<ProjectState, null>[] = [
  'ALL', 'PENDING', 'APPROVAL', 'REJECTED', 'MODIFY', 'WRITING'
];

const isValidProjectState = (state: string): state is ProjectState => {
  return VALID_PROJECT_STATES.includes(state as ProjectState);
};

export const getWrittenProjects = async (
  req: AuthenticatedRequest<{}, {}, {}, { state?: ProjectState }>,
  res: Response<BasicResponse | GetProjectResponse>
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ message: '토큰 검증 실패' });
    }

    const rawState = req.query.state?.trim().toUpperCase() || 'ALL';

    if (!isValidProjectState(rawState)) {
      return res.status(400).json({
        message: '잘못된 프로젝트 상태입니다.'
      });
    }

    const isAll = rawState === 'ALL';

    const projectsFromDb = await prisma.project.findMany({
      select: {
        id: true,
        projectName: true,
        introduction: true,
        authorCategory: true,
        image: true,
      },
      where: {
        writerId: userId,
        ...(isAll ? {} : { state: rawState }),
      },
      orderBy: { projectName: 'asc' },
    });

    const projects = projectsFromDb.map((project) => ({
      ...project,
      id: project.id.toString(),
    }));

    return res.status(200).json({ projects });

  } catch (err) {
    console.error('getWrittenProjects error:', err);
    return res.status(500).json({ message: '서버 오류 발생' });
  }
};
