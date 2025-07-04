import { prisma } from '../../config/prisma';
import { Response, Request, RequestHandler } from 'express';
import { BasicResponse } from '../../types';
import { GetProjectResponse } from '../../types/user';
import { buildFileUrl } from '../../utils/buildFileUrl';

export const getJoinedProjectsHandler: RequestHandler<unknown, BasicResponse | GetProjectResponse> = async (
  req,
  res
) => {
  await getJoinedProjects(req, res);
};

const getJoinedProjects = async (
  req: Request<unknown, BasicResponse | GetProjectResponse>,
  res: Response<BasicResponse | GetProjectResponse>
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: '토큰 검증 실패' });
    }
    
    const userId = BigInt(req.userId);

    const projects = await prisma.project.findMany({
      select: {
        id: true,
        projectName: true,
        introduction: true,
        authorCategory: true,
        image: true
      },
      where: {
        AND: [
          {
            OR: [{ writerId: userId }, { member: { some: { studentId: userId } } }]
          }
        ]
      },
      orderBy: { projectName: 'asc' }
    });

    const mappedProjects = projects.map((project) => ({
      ...project,
      id: project.id.toString(),
      image: buildFileUrl(project.image)
    }));

    return res.status(200).json({
      projects: mappedProjects
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
