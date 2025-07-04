import { ContestState, prisma, ProjectState } from '../../config/prisma';
import { Request, RequestHandler, Response } from 'express';
import { BasicResponse } from '../../types';
import { AwardResponse, RankProjectResponse, GetRankResponse } from '../../types/project';
import { ContestParams } from '../../types/contest';
import { buildFileUrl } from '../../utils/buildFileUrl';

// 수상작 조회

export const rankingHandler: RequestHandler<ContestParams, BasicResponse | GetRankResponse> = async (req, res) => {
  await ranking(req, res);
};

const ranking = async (
  req: Request<ContestParams, BasicResponse | GetRankResponse>,
  res: Response<BasicResponse | GetRankResponse>
) => {
  try {
    const contestId = BigInt(req.params.contestId);
    if (!contestId) {
      return res.status(400).json({ message: 'contestId가 필요합니다' });
    }

    const contest = await prisma.contest.findUnique({
      where: { id: contestId, state: ContestState.FINISHED },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true
      }
    });

    if (!contest) {
      return res.status(404).json({
        message: '해당 대회가 없습니다'
      });
    }

    const awardProjects = await prisma.award.findMany({
      where: { contestId: contestId },
      select: {
        name: true,
        awardProject: {
          select: {
            project: {
              select: {
                id: true,
                projectName: true,
                authorCategory: true,
                introduction: true,
                image: true
              }
            }
          },
          where: { project: { state: ProjectState.APPROVAL } }
        }
      }
    });

    const projects: RankProjectResponse[] = awardProjects.flatMap((award) =>
      award.awardProject.map((p) => ({
        id: p.project.id.toString(),
        projectName: p.project.projectName,
        authorCategory: p.project.authorCategory,
        introduction: p.project.introduction,
        image: buildFileUrl(p.project.image),
        award: award.name
      }))
    );

    const awards: AwardResponse[] = awardProjects.map((award) => ({
      name: award.name
    }));

    return res.status(200).json({
      contestId: contestId.toString(),
      name: contest.name,
      startDate: contest.startDate,
      endDate: contest.endDate,
      awards: awards,
      projects: projects
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
