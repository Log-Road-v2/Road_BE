import { prisma } from '../../config/prisma';
import { ProjectState } from '@prisma/client';
import { RequestHandler, Response, Request } from 'express';
import { BasicResponse } from '../../types';
import { RegisterProjectBody, ProjectIdParam } from '../../types/project';
import { validateProjectInput } from '../../utils/validation';
import { getRelativePath } from '../../utils/format';

// 프로젝트 글 수정

export const updateProjectHandler: RequestHandler<ProjectIdParam, RegisterProjectBody | BasicResponse> = async (
  req,
  res
) => {
  await updateProject(req, res);
};

const updateProject = async (
  req: Request<ProjectIdParam, RegisterProjectBody | BasicResponse>,
  res: Response<BasicResponse | RegisterProjectBody>
) => {
  try {
    const userId = req.userId;

    const { projectId: rawProjectId } = req.params;
    if (!rawProjectId) {
      return res.status(400).json({ message: '잘못된 프로젝트 ID입니다' });
    }

    const { contestId: rawContestId } = req.body;
    if (!rawContestId) {
      return res.status(400).json({ message: '잘못된 대회 ID입니다.' });
    }

    const { projectName, authorCategory, teamName, introduction, description, startDate, endDate } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const image = files?.['image'][0] ?? null;
    const video = files?.['video'][0] ?? null;
    const imageUri = image ? getRelativePath(image.path) : null;
    const videoUri = video ? getRelativePath(video.path) : null;

    if (!userId) {
      return res.status(401).json({ message: '토큰 검증 실패' });
    }

    const validationResult = validateProjectInput(req.body);
    if (!validationResult.valid) {
      return res.status(400).json({ message: validationResult.message || '' });
    }

    const projectId = BigInt(rawProjectId);
    const contestId = BigInt(rawContestId);

    const [existingProject, contest] = await Promise.all([
      prisma.project.findUnique({ where: { id: projectId } }),
      prisma.contest.findUnique({ where: { id: contestId } })
    ]);

    if (!existingProject) {
      return res.status(404).json({ message: '수정할 프로젝트를 찾을 수 없습니다.' });
    }
    if (existingProject.writerId !== userId && existingProject.state === ProjectState.WRITING) {
      return res.status(403).json({ message: '프로젝트를 수정할 권한이 없습니다.' });
    }
    if (!contest) {
      return res.status(404).json({ message: '해당 대회를 찾을 수 없습니다.' });
    }

    const { filteredSkills = [], filteredMembers = [] } = validationResult;

    const updateData = {
      contestId,
      writerId: userId,
      projectName,
      authorCategory,
      teamName,
      skills: filteredSkills.length > 0 ? filteredSkills.join(',') : null,
      introduction,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      image: imageUri,
      video: videoUri,
      state: ProjectState.MODIFY
    };

    await prisma.$transaction(async (tx) => {
      const updated = await tx.project.update({
        where: { id: projectId, user: { id: userId } },
        data: updateData
      });

      await tx.member.deleteMany({ where: { projectId: updated.id } });

      if (filteredMembers.length > 0) {
        const memberData = filteredMembers.map((m) => ({
          studentId: m.studentId,
          projectId: updated.id
        }));
        await tx.member.createMany({ data: memberData });
      }
    });

    return res.status(200).json({
      message: '프로젝트가 성공적으로 수정되었습니다.'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
