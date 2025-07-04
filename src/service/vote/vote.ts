import { prisma } from '../../config/prisma';
import { BasicResponse } from '../../types';
import { Request, RequestHandler, Response } from 'express';
import { VoteRequest } from '../../types/vote';
import { ContestParams } from '../../types/contest';

export const voteHandler: RequestHandler<ContestParams, BasicResponse, VoteRequest> = async (req, res) => {
  await vote(req, res);
};

const vote = async (req: Request<ContestParams, BasicResponse, VoteRequest>, res: Response<BasicResponse>) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: '인증된 사용자만 투표할 수 있습니다.' });
    }

    const { votes } = req.body;

    if (!Array.isArray(votes)) {
      return res.status(400).json({ message: '투표 정보가 없습니다.' });
    }

    const myVotes = await prisma.vote.findMany({
      where: { userId: userId },
      select: { id: true }
    });
    const myVotesId = myVotes.map((myVote) => myVote.id);

    const votesData: { userId: bigint; projectId: bigint; rank: string }[] = votes.map((v) => ({
      userId: userId,
      projectId: BigInt(v.projectId),
      rank: v.rank.toString()
    }));

    await prisma.$transaction(async (tx) => {
      if (myVotes) {
        await tx.vote.deleteMany({
          where: { id: { in: myVotesId } }
        });
      }

      await tx.vote.createMany({
        data: votesData
      });
    });

    return res.status(201).json();
  } catch (err) {
    console.error('투표 오류:', err);
    return res.status(500).json({ message: '투표를 실패했습니다.' });
  }
};
