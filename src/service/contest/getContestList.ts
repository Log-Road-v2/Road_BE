import { prisma } from "../../config/prisma";
import { Response } from "express";
import { AuthenticatedRequest, BasicResponse } from "../../types";
import { getContestResponse, ContestData } from "../../types/contest";
import { formatDate } from "../../utils/regex";

// 대회 목록 조회

export const getContestList = async (
  req: AuthenticatedRequest,
  res: Response<BasicResponse | getContestResponse>
) => {
  try {
    const contests = await prisma.contest.findMany({
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true
      },
      orderBy: { id: 'asc' }
    })

    if (contests.length === 0) {
      return res.status(200).json({ contests: [] });
    }

    const formattedContests: ContestData[] = contests.map((contest) => ({
      id: contest.id.toString(),
      name: contest.name,
      startDate: formatDate(contest.startDate),
      endDate: formatDate(contest.endDate)
    }));
    
    return res.status(200).json({ contests: formattedContests });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "서버 오류 발생",
    });
  }
}