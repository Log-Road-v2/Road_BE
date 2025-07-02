import { prisma } from '../../config/prisma';
import { RequestHandler, Response, Request } from 'express';
import { BasicResponse } from '../../types';
import { GetArchivesResponse, ProjectResponse, GetArchivesParam, SearchProjectQuery } from '../../types/project';
import { formatDate } from '../../utils/regex';
import { buildFileUrl } from '../../utils/buildFileUrl';

// 아카이브 조회

const PAGE_SIZE = 10;

export const archivesHandler: RequestHandler<
  GetArchivesParam,
  GetArchivesResponse | BasicResponse,
  unknown,
  SearchProjectQuery
> = async (req, res) => {
  await getArchives(req, res);
};

const getArchives = async (
  req: Request<GetArchivesParam, GetArchivesResponse | BasicResponse, unknown, SearchProjectQuery>,
  res: Response<BasicResponse | GetArchivesResponse>
) => {
  try {
    const userId = req.userId ?? undefined;
    const { contestId } = req.params;

    const rawOffset = Number(req.query.offset);
    const offset = Number.isInteger(rawOffset) && rawOffset > 0 ? rawOffset : 1;
    const skip = PAGE_SIZE * (offset - 1);

    const contest = await prisma.contest.findUnique({
      where: { id: BigInt(contestId) },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        purpose: true
      }
    });

    if (!contest) {
      return res.status(404).json({ message: '해당 대회가 없습니다' });
    }

    const [projects, totalProjectCount] = await prisma.$transaction([
      prisma.project.findMany({
        select: {
          id: true,
          projectName: true,
          authorCategory: true,
          introduction: true,
          image: true,
          ...(userId && {
            mark: {
              where: { userId },
              select: { id: true },
              take: 1
            }
          })
        },
        where: { contestId: BigInt(contestId) },
        skip,
        take: PAGE_SIZE,
        orderBy: { projectName: 'asc' }
      }),
      prisma.project.count({
        where: { contestId: BigInt(contestId) }
      })
    ]);

    const formattedProjects: ProjectResponse[] = projects.map((project) => ({
      id: project.id.toString(),
      projectName: project.projectName,
      authorCategory: project.authorCategory,
      introduction: project.introduction,
      image: buildFileUrl(project.image),
      isMark: userId ? project.mark?.length > 0 : null
    }));

    const response: GetArchivesResponse = {
      contestId: contest.id.toString(),
      name: contest.name,
      startDate: formatDate(contest.startDate),
      endDate: formatDate(contest.endDate),
      purpose: contest.purpose,
      offset,
      totalProject: totalProjectCount,
      projects: formattedProjects
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
