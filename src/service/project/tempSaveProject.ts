import { prisma } from "../../config/prisma";
import { Response } from "express";
import { AuthenticatedRequest, BasicResponse } from "../../types";
import { RegisterProjectBody } from "../../types/project";
import { ProjectState } from "../../config/prisma";

// 임시 저장

export const tempSaveProject = async (
  req: AuthenticatedRequest<{}, {}, RegisterProjectBody>,
  res: Response<BasicResponse>
) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({
        message: "토큰 검증 실패",
      });
    }

    const projectId = BigInt(req.body.projectId || 0)
    const contestId = BigInt(req.body.contestId)
    const { projectName, authorCategory, teamName, introduction, description, startDate, endDate, image, video, skills, members  } = req.body

    const contest = await prisma.contest.findUnique({
      where: { id : contestId },
    })

    if(!contest) {
      return res.status(404).json({
        message: "해당 대회를 찾을 수 없습니다."
      })
    }

    const data = {
      contestId,
      writerId: userId,
      projectName,
      authorCategory,
      teamName,
      skills: Array.isArray(skills) && skills.length ? skills.join(",") : null,
      introduction,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      image: image ?? null,
      video: video ?? null,
      state: ProjectState.WRITING
    }

    await prisma.$transaction(async (tx) => {
      await tx.project.upsert({
        where: { id: projectId },
        update: {
          ...data
        },
        create: {
          ...data
        }
      })
    });

    return res.status(201).json({
      message: "프로젝트가 임시저장 되었습니다.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "서버 오류 발생",
    });
  }
};
