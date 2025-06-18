import { prisma } from "../../config/prisma";
import { Response } from "express";
import { AuthenticatedRequest, BasicResponse } from "../../types";
import { GetProjectDetailResponse, StudentResponse } from "../../types/project";
import { formatDate } from "../../utils/regex";

// 프로젝트 상세 조회

export const getProjectDetail = async (
  req: AuthenticatedRequest,
  res: Response<BasicResponse | GetProjectDetailResponse>
) => {
  try {
    const userId = req.userId ?? undefined;
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        projectName: true,
        authorCategory: true,
        teamName: true,
        skills: true,
        introduction: true,
        description: true,
        startDate: true,
        endDate: true,
        image: true,
        video: true,
        state: true,
        contest: { select: { name: true } },
        member: {
          select: {
            student: { select: { id: true, name: true } }
          }
        },
        writerId: true,
        mark: {
          where: { userId },
          select: { id: true },
          take: 1,
        },
      }
    })

    if(!project) {
      return res.status(404).json({
        message: '요청한 정보가 존재하지 않습니다'
      })
    }

    const skillsArray = project.skills
    ? project.skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
    : [];

    const memberList: StudentResponse[] = (project.member ?? [])
    .filter(({ student }) => student !== null)
    .map(({ student }) => ({
      studentId: student!.id,
      name: student!.name || undefined,
    }));

    const result: GetProjectDetailResponse = {
      contestName: project.contest.name,
      isMark: project.mark.length > 0,
      isWriter: project.writerId === userId,
      projectName: project.projectName,
      authorCategory: project.authorCategory,
      teamName: project.teamName,
      member: memberList,
      skills: skillsArray,
      introduction: project.introduction,
      description: project.description,
      startDate: formatDate(project.startDate),
      endDate: formatDate(project.endDate),
      image: project.image,
      video: project.video,
      state: project.state,
    };

    return res.status(200).json(result)

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    })
  }
}