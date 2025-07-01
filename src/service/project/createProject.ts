import { ProjectState, prisma } from "../../config/prisma";
import { RequestHandler, Request, Response } from "express";
import { BasicResponse } from "../../types";
import { RegisterProjectBody } from "../../types/project";
import { validateProjectInput } from "../../utils/validation"

// 프로젝트 생성

export const createProjectHandler: RequestHandler <unknown, BasicResponse | RegisterProjectBody> = (req, res) => {
  createProject(req, res)
}

const createProject = async (
  req: Request<unknown, BasicResponse | RegisterProjectBody>,
  res: Response<RegisterProjectBody | BasicResponse>
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

    const { projectName, authorCategory, teamName, introduction, description, startDate, endDate, image, video } = req.body

    if (!contestId || !projectName || !authorCategory || !startDate || !endDate) {
      return res.status(400).json({ message: "필수 입력값이 누락되었습니다." });
    }

    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      return res.status(404).json({
        message: "해당 대회를 찾을 수 없습니다.",
      });
    }

    const now = new Date();
    if (now < new Date(contest.startDate)) {
      return res.status(400).json({ message: "아직 제출 기간이 아닙니다." });
    }

    if (new Date(contest.endDate) < now) {
      return res.status(400).json({
        message: "이미 마감된 대회에는 프로젝트를 제출할 수 없습니다.",
      });
    }

    if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        message: "시작일과 종료일을 올바르게 입력해주세요.",
      });
    }

    if (authorCategory === 'TEAM' && !teamName) {
      return res.status(400).json({
        message: "팀 프로젝트인 경우 팀 이름은 필수입니다.",
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
        where: { id: projectId, user: { id: userId } },
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
