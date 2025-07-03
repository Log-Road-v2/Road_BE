import { prisma } from '../../config/prisma';
import { RequestHandler } from 'express';
import { BasicResponse } from '../../types';
import { ContestResponse, ContestData } from '../../types/contest';
import { formatDate } from '../../utils/regex';

// 대회 목록 조회

export const getContestList: RequestHandler<unknown, ContestResponse | BasicResponse> = async (_req, res) => {
  try {
    const contests = await prisma.contest.findMany({
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true
      },
      orderBy: { startDate: 'asc' }
    });

    const formattedContests: ContestData[] = contests.map((contest) => ({
      id: String(contest.id),
      name: contest.name,
      startDate: formatDate(contest.startDate),
      endDate: formatDate(contest.endDate)
    }));

    res.status(200).json({ contests: formattedContests });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
