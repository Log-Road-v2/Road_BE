import { prisma } from '../../config/prisma';
import { BasicResponse } from '../../types';
import { Request, RequestHandler, Response } from 'express';
import { VoteRequest } from '../../types/vote';
import { ContestParams } from '../../types/contest';

export const voteHandler: RequestHandler<ContestParams, BasicResponse | VoteRequest> = async (req, res) => {
  await vote(req, res);
};

const vote = async (
  req: Request<ContestParams, BasicResponse | VoteRequest>,
  res: Response<BasicResponse | VoteRequest>
) => {
  try {
    const contestId = BigInt(req.params.contestId);

    if (!req.userId) {
      return res.status(401).json({ message: '인증된 사용자만 투표할 수 있습니다.' });
    }
    const userId = req.userId;

    const { votes } = req.body;

    if (!Array.isArray(votes)) {
      return res.status(400).json({ message: '투표 정보가 없습니다.' });
    }

    await prisma.vote.createMany({
      data: votes.map((vote) => ({
        contestId,
        userId,
        projectId: BigInt(vote.projectId),
        rank: vote.rank.toString()
      }))
    });

    return res.status(201).json();
  } catch (err) {
    console.error('투표 오류:', err);
    return res.status(500).json({ message: '투표를 실패했습니다.' });
  }
};
