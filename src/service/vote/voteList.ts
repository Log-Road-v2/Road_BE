import { Request, RequestHandler, Response } from 'express';
import { prisma } from '../../config/prisma';
import { VoteListResponse } from '../../types/vote';
import { BasicResponse } from '../../types';
import { Project } from '../../types/vote';

export const voteListHandler: RequestHandler<{ contestId: string }, BasicResponse | VoteListResponse, unknown> = async (
  req,
  res
) => {
  await voteList(req, res);
};

const voteList = async (
  req: Request<{ contestId: string }, BasicResponse | VoteListResponse, unknown>,
  res: Response<BasicResponse | VoteListResponse>
) => {
  try {
    const contestId = BigInt(req.params.contestId);
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
      select: {
        id: true,
        name: true,
        award: { select: { name: true } },
        project: { select: { id: true, projectName: true, authorCategory: true, introduction: true, image: true } }
      }
    });
    if (!contest) {
      return res.status(404).json({
        message: '존재하지 않는 대회'
      });
    }

    const projects: Project[] = contest.project.map((p) => ({
      id: p.id.toString(),
      projectName: p.projectName,
      authorCategory: p.authorCategory,
      introduction: p.introduction || '',
      image: p.image || ''
    }));

    const result: VoteListResponse = {
      contestId: contest.id.toString(),
      name: contest.name,
      awards: contest.award,
      projects: projects
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching vote list:', err);
    return res.status(500).json({
      message: '투표 후보 목록을 불러오는데 실패했습니다.'
    });
  }
};
