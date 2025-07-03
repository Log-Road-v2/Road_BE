import { ContestState, prisma } from '../../config/prisma';
import { Response, RequestHandler, Request } from 'express';
import { BasicResponse } from '../../types';
import { ContestData, ContestResponse } from '../../types/contest';
import { formatDate } from '../../utils/regex';

// 현재 진행중인 대회 목록 조회

export const getOngoingContests: RequestHandler<unknown, ContestResponse | BasicResponse> = async (_req, res) => {
  try {
    const contests = await prisma.contest.findMany({
      where: {
        state: {
          in: [ContestState.NOW, ContestState.VOTING, ContestState.PENDING]
        }
      },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true
      },
      orderBy: { startDate: 'asc' }
    });

    const formattedContests: ContestData[] = contests.map(({ id, name, startDate, endDate }) => ({
      id: id.toString(),
      name,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate)
    }));

    res.status(200).json({ contests: formattedContests });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
