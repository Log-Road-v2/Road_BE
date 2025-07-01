import { prisma } from "../../config/prisma";
import { Response, Request, RequestHandler } from "express";
import { BasicResponse } from "../../types";
import { GetDraftProjectResponse, ProjectIdParam, RequestUser } from "../../types/project";
import { formatDate, formatMembers } from "../../utils/regex";

// 임시저장 불러오기

export const loadTempSavedProjectHandler: RequestHandler<ProjectIdParam, GetDraftProjectResponse | BasicResponse, RequestUser> = (req, res) => {
  loadTempSavedProject(req, res);
}

const loadTempSavedProject = async (
  req: Request<ProjectIdParam, GetDraftProjectResponse | BasicResponse, RequestUser>,
  res: Response<BasicResponse | GetDraftProjectResponse>
) => {
  try {
    const userId = req.userId?.toString();
    const { projectId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ message: "토큰 검증 실패" });
    }

    if (!projectId) {
      return res.status(400).json({ message: "유효하지 않은 프로젝트 ID입니다." });
    }

    const project = await fetchDraftProject(projectId, userId);

    if (!project) {
      return res.status(404).json({ message: "임시 저장된 프로젝트를 찾을 수 없습니다." });
    }

    const response = mapToDraftResponse(project);
    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "서버 오류 발생",
    });
  }
};

const fetchDraftProject = async (projectId: string, userId: string) => {
  return await prisma.project.findFirst({
    where: {
      id: BigInt(projectId),
      writerId: BigInt(userId),
      state: "WRITING",
    },
    select: {
      contestId: true,
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
      member: {
        select: {
          studentId: true,
          student: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
};

const mapToDraftResponse = (
  project: NonNullable<Awaited<ReturnType<typeof fetchDraftProject>>>
  ) : GetDraftProjectResponse => {
  return {
    contestId: project.contestId.toString(),
    projectName: project.projectName,
    authorCategory: project.authorCategory,
    teamName: project.teamName,
    skills: project.skills,
    members: formatMembers(project.member ?? []), 
    introduction: project.introduction,
    description: project.description,
    startDate: formatDate(project.startDate),
    endDate: formatDate(project.endDate),
    image: project.image,
    video: project.video,
  };
};