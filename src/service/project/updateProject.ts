import { prisma } from "../../config/prisma";
import { Response } from "express";
import { AuthenticatedRequest, BasicResponse } from "../../types";
import { RegisterProjectBody } from "../../types/project"
import { validateProjectInput } from "../../utils/validation"
import { ProjectState } from "../../config/prisma";

// 프로젝트 글 수정

export const updateProject = async (
  req: AuthenticatedRequest<{}, {}, RegisterProjectBody>,
  res: Response<BasicResponse>
) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ 
        message: '토큰 검증 실패'
       })
    }

    const validationResult = validateProjectInput(req.body);
    if (!validationResult.valid) {
      return res.status(400).json({ message: validationResult.message || "" });
    }


    const projectId = BigInt((req.params as { projectId: string }).projectId || "0");
    const contestId = BigInt(req.body.contestId)

    if (!contestId) {
      return res.status(400).json({ message: "잘못된 대회 ID입니다." });
    }

    const {
      projectName,
      authorCategory,
      teamName,
      introduction,
      description,
      startDate,
      endDate,
      image,
      video,
    } = req.body;

    const { filteredSkills = [], filteredMembers = [] } = validationResult;

    const [existingProject, contest] = await Promise.all([
      prisma.project.findUnique({ where: { id: projectId } }),
      prisma.contest.findUnique({ where: { id: contestId } }),
    ]);

    if (!existingProject) {
      return res.status(404).json({ message: "수정할 프로젝트를 찾을 수 없습니다." });
    }

    if (existingProject.writerId !== userId) {
      return res.status(403).json({ message: "프로젝트를 수정할 권한이 없습니다." });
    }

    if (!contest) {
      return res.status(404).json({ message: "해당 대회를 찾을 수 없습니다." });
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
      state: ProjectState.MODIFY
    }

    await prisma.$transaction(async (tx) => {
      const updatedProject = await tx.project.update({
        where: { id: projectId, user: { id: userId } },
        data
      });

      await tx.member.deleteMany({ where: { projectId: updatedProject.id } });

      if (filteredMembers.length > 0) {
        const memberData = filteredMembers.map((m) => ({
          studentId: m.studentId,
          projectId: updatedProject.id,
        }));
        await tx.member.createMany({ data: memberData });
      }
    })

    return res.status(200).json({
      message: "프로젝트가 성공적으로 수정되었습니다.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    })
  }
}