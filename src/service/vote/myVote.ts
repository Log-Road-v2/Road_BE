import { Request, RequestHandler, Response } from 'express';
import { prisma } from '../../config/prisma';
import { MyVoteResponse } from '../../types/vote';
import { BasicResponse } from '../../types';

export const myVoteHandler: RequestHandler<{ contestId: string }, BasicResponse | MyVoteResponse, unknown> = async (
  req,
  res
) => {
  await voteList(req, res);
};

const voteList = async (
  req: Request<{ contestId: string }, BasicResponse | MyVoteResponse, unknown>,
  res: Response<BasicResponse | MyVoteResponse>
) => {
  try {
    const contestId = BigInt(req.params.contestId);
    const votes = await prisma.vote.findMany({
      where: {
        userId: req.userId,
        project: {
          contestId: contestId
        }
      },
      select: {
        id: true,
        projectId: true,
        rank: true
      }
    });
    if (votes.length === 0) {
      return res.status(404).json({
        message: '투표한 프로젝트가 없습니다.'
      });
    }

    const result: MyVoteResponse = {
      project: votes.map((vote: any) => ({
        id: vote.id.toString(),
        projectId: vote.projectId.toString(),
        rank: vote.rank.toString()
      }))
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching vote list:', err);
    return res.status(500).json({
      message: '내 투표 목록을 불러오는데 실패했습니다.'
    });
  }
};
