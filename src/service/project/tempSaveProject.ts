import { prisma } from '../../config/prisma';
import { RequestHandler, Response, Request } from 'express';
import { BasicResponse } from '../../types';
import { RegisterProjectBody, StudentResponse } from '../../types/project';
import { ProjectState } from '../../config/prisma';
import { getRelativePath } from '../../utils/format';

// 임시 저장

export const tempSaveProjectHandler: RequestHandler<unknown, BasicResponse, RegisterProjectBody> = (req, res) => {
  tempSaveProject(req, res);
};

const tempSaveProject = async (
  req: Request<unknown, BasicResponse, RegisterProjectBody>,
  res: Response<BasicResponse>
) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: '토큰 검증 실패' });
    }

    const {
      projectId: rawProjectId,
      contestId: rawContestId,
      projectName,
      authorCategory,
      teamName,
      members,
      introduction,
      description,
      startDate,
      endDate,
      skills
    } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const image = files?.['image'][0] ?? null;
    const video = files?.['video'][0] ?? null;
    const imageUri = image ? getRelativePath(image.path) : null;
    const videoUri = video ? getRelativePath(video.path) : null;

    const projectId = rawProjectId ? BigInt(rawProjectId) : null;
    const contestId = BigInt(rawContestId);

    const skillsJson = JSON.parse(skills) as string[];
    const skillsList = skillsJson.filter((s) => s.trim().length > 0) || [];

    const contest = await prisma.contest.findUnique({
      where: { id: contestId }
    });
    if (!contest) {
      return res.status(404).json({ message: '해당 대회를 찾을 수 없습니다.' });
    }

    const data = {
      contestId,
      writerId: userId,
      projectName,
      authorCategory,
      teamName,
      skills: Array.isArray(skillsList) && skillsList.length ? skillsList.join(',') : null,
      introduction,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      image: imageUri,
      video: videoUri,
      state: ProjectState.WRITING
    };

    const project = projectId ? await prisma.project.findUnique({ where: { id: projectId } }) : null;

    await prisma.$transaction(async (tx) => {
      let projectResult;
      if (project) {
        projectResult = await tx.project.update({
          where: { id: project.id, user: { id: userId } },
          data: data
        });
        await tx.member.deleteMany({
          where: { projectId: project.id }
        });
      } else {
        projectResult = await tx.project.create({
          data: data
        });
      }
      if (members?.length) {
        const member = JSON.parse(members) as StudentResponse[];
        const memberData = member.map((m) => ({
          studentId: BigInt(m.studentId),
          projectId: projectResult.id
        }));
        await tx.member.createMany({ data: memberData });
      }
    });

    return res.status(201).json({
      message: '프로젝트가 임시저장 되었습니다.'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
