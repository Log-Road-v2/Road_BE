import { Request, RequestHandler, Response } from 'express';
import { ContestState, prisma, ProjectState } from '../../config/prisma';
import { VoteListResponse } from '../../types/vote';
import { BasicResponse } from '../../types';
import { Project } from '../../types/vote';
import { buildFileUrl } from '../../utils/buildFileUrl';
import { ContestParams } from '../../types/contest';

export const voteListHandler: RequestHandler<ContestParams, BasicResponse | VoteListResponse> = async (req, res) => {
  await voteList(req, res);
};

const voteList = async (
  req: Request<ContestParams, BasicResponse | VoteListResponse>,
  res: Response<BasicResponse | VoteListResponse>
) => {
  try {
    const contestId = BigInt(req.params.contestId);

    const contest = await prisma.contest.findUnique({
      select: {
        id: true,
        name: true,
        award: true,
        state: true
      },
      where: { id: contestId }
    });
    if (!contest || contest.state !== ContestState.VOTING) {
      return res.status(404).json({
        message: '존재하지 않는 대회'
      });
    }

    const projects = await prisma.project.findMany({
      where: {
        contestId: contestId,
        state: ProjectState.APPROVAL
      },
      select: {
        id: true,
        projectName: true,
        authorCategory: true,
        introduction: true,
        image: true
      }
    });
    const projectResult: Project[] = projects.map((p) => ({
      id: p.id.toString(),
      projectName: p.projectName,
      authorCategory: p.authorCategory,
      introduction: p.introduction || '',
      image: buildFileUrl(p.image)
    }));

    const result: VoteListResponse = {
      contestId: contest.id.toString(),
      name: contest.name,
      awards: contest.award,
      projects: projectResult
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching vote list:', err);
    return res.status(500).json({
      message: '투표 후보 목록을 불러오는데 실패했습니다.'
    });
  }
};
