import { prisma } from '../../config/prisma';
import { Request, RequestHandler, Response } from 'express';
import { BasicResponse } from '../../types';
import { AwardResponse, RankProjectResponse, getRankResponse } from '../../types/project';

// 수상작 조회

export const rankingHandler: RequestHandler<{ contestId: string }, BasicResponse | getRankResponse, unknown> = async (
  req,
  res
) => {
  await ranking(req, res);
};

const ranking = async (
  req: Request<{ contestId: string }, BasicResponse | getRankResponse, unknown>,
  res: Response<BasicResponse | getRankResponse>
) => {
  try {
    const contestIdParam = req.params.contestId;

    if (!contestIdParam) {
      return res.status(400).json({ message: 'contestId가 필요합니다' });
    }

    const contestId = BigInt(contestIdParam);
    const contest = await prisma.contest.findUnique({
      where: { id: BigInt(contestId) },
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

    const awards = await prisma.award.findMany({
      where: { contestId: BigInt(contestId) },
      select: {
        name: true
      }
    });

    const projects = await prisma.project.findMany({
      where: {
        contestId: BigInt(contestId),
        awardProject: {
          some: {}
        }
      },
      select: {
        id: true,
        projectName: true,
        authorCategory: true,
        introduction: true,
        image: true,
        awardProject: {
          select: {
            award: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    const formattedProjects: RankProjectResponse[] = projects.map((project) => ({
      id: project.id.toString(),
      projectName: project.projectName,
      authorCategory: project.authorCategory,
      introduction: project.introduction,
      image: project.image,
      award: project.awardProject.map((ap) => ap.award.name).join(', ')
    }));

    const formattedAwards: AwardResponse[] = awards.map((award) => ({
      name: award.name
    }));

    const response: getRankResponse = {
      contestId: contest.id.toString(),
      name: contest.name,
      startDate: contest.startDate,
      endDate: contest.endDate,
      awards: formattedAwards,
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
