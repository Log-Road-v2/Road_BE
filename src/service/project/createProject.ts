import { ProjectState, prisma } from "../../config/prisma";
import { Response } from "express";
import { AuthenticatedRequest, BasicResponse } from "../../types";
import { RegisterProjectBody } from "../../types/project";
import { validateProjectInput } from "../../utils/validation"

// 프로젝트 생성

export const createProject = async (
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

    const validationResult = validateProjectInput(req.body);

    if (!validationResult.valid) {
      return res.status(400).json({ message: validationResult.message || "" });
    }

    const projectId = BigInt(req.body.projectId || 0)
    const contestId = BigInt(req.body.contestId)
    const filteredSkills = validationResult.filteredSkills || [];
    const filteredMembers = validationResult.filteredMembers || [];
    const {projectName, authorCategory, teamName, introduction, description, startDate, endDate, image, video} = req.body

    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      return res.status(404).json({
        message: "해당 대회를 찾을 수 없습니다.",
      });
    }

    const data = {
      contestId,
      writerId: userId,
      projectName,
      authorCategory,
      teamName,
      skills: filteredSkills.length > 0 ? filteredSkills.join(",") : null,
      introduction,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      image: image ?? null,
      video: video ?? null,
      state: ProjectState.PENDING
    }

    await prisma.$transaction(async (tx) => {
      const projectResult = await tx.project.upsert({
        where: { id: projectId },
        update: {
          ...data
        },
        create: {
          ...data
        },
      });

      if (filteredMembers.length) {
        const memberData = filteredMembers.map((m) => ({
          studentId: m.studentId,
          projectId: projectResult.id,
        }));
        await tx.member.createMany({ data: memberData });
      }
    })

    return res.status(201).json({
      message: "프로젝트가 성공적으로 생성되었습니다.",
    });
  } catch (err) {
    return res.status(500).json({
      message: "서버 오류 발생",
    });
  }
};
