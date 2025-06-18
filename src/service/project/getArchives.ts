import { prisma } from "../../config/prisma";
import { Response } from "express";
import { AuthenticatedRequest, BasicResponse } from "../../types";
import { GetArchivesResponse, ProjectResponse } from "../../types/project";
import { formatDate } from "../../utils/regex";

// 아카이브 조회

const PAGE_SIZE = 10

export const getArchives = async (
  req: AuthenticatedRequest,
  res: Response<BasicResponse | GetArchivesResponse>
) => {
  try {
    const userId = req.userId ?? undefined

    const contestId = req.params.contestId
    const offset = Number(req.query.offset) || 1;
    const pageIndex = Math.max((isNaN(offset) ? 1 : offset) - 1, 0);
    const skipAmount = PAGE_SIZE * pageIndex;

    const contest = await prisma.contest.findUnique({
      where: {id: BigInt(contestId)},
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        purpose: true
      }
    })

    if(!contest) {
      return res.status(404).json({
        message: "해당 대회가 없습니다"
      })
    }

    const [projects, totalProjectCount] = await prisma.$transaction([
      prisma.project.findMany({
        select: {
          id: true,
          projectName: true,
          authorCategory: true,
          introduction: true,
          image: true,
          ...(userId && {mark: {
            where: { userId },
            select: { id: true },
            take: 1,
          }}),
        },
        where: { 
          contestId: contestId
        },
        skip: skipAmount,
        take: PAGE_SIZE,
        orderBy: {projectName: 'asc'}
      }),
      prisma.project.count({
        where: { 
          contestId: contestId
         }
      })
    ])

  const formattedProjects: ProjectResponse[] = projects.map((project) => ({
      id: project.id.toString(),
      projectName: project.projectName,
      authorCategory: project.authorCategory,
      introduction: project.introduction,
      image: project.image,
      isMark: userId ? (project.mark && project.mark.length > 0 ? true : false) : null
    }));

    const response: GetArchivesResponse = {
      contestId: contest.id.toString(),
      name: contest.name,
      startDate: formatDate(contest.startDate),
      endDate: formatDate(contest.endDate),
      purpose: contest.purpose,
      offset,
      totalProject: totalProjectCount,
      projects: formattedProjects
    };

    return res.status(200).json(response)

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    })
  }
}

