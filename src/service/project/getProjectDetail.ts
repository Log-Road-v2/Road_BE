import { prisma } from '../../config/prisma';
import { RequestHandler, Response, Request } from 'express';
import { BasicResponse } from '../../types';
import { GetProjectDetailResponse, StudentResponse, ProjectIdParam } from '../../types/project';
import { formatDate } from '../../utils/regex';
import { buildFileUrl } from '../../utils/buildFileUrl';

// 프로젝트 상세 조회
const parseSkills = (skills?: string): string[] =>
  skills
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) || [];

const mapMembers = (members: { student: { id: bigint; name: string } | null }[]): StudentResponse[] =>
  members
    .filter(({ student }) => student !== null)
    .map(({ student }) => ({
      studentId: student!.id.toString(),
      name: student!.name || undefined
    }));

export const getProjectDetailHandler: RequestHandler<ProjectIdParam, GetProjectDetailResponse | BasicResponse> = async (
  req,
  res
) => {
  await getProjectDetail(req, res);
};

const getProjectDetail = async (
  req: Request<ProjectIdParam, GetProjectDetailResponse | BasicResponse>,
  res: Response<BasicResponse | GetProjectDetailResponse>
) => {
  try {
    const userId = req.userId ?? undefined;
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: BigInt(projectId) },
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
          take: 1
        }
      }
    });

    if (!project) {
      return res.status(404).json({
        message: '요청한 정보가 존재하지 않습니다'
      });
    }

    const skillsArray = parseSkills(project.skills ?? undefined);
    const memberList = mapMembers(project.member ?? []);

    const result: GetProjectDetailResponse = {
      contestName: project.contest.name,
      isMark: !!project.mark?.length,
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
      image: buildFileUrl(project.image),
      video: buildFileUrl(project.video),
      state: project.state
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
