import { Author, prisma } from '../../config/prisma';
import { RequestHandler, Request, Response } from 'express';
import { BasicResponse } from '../../types';
import { RegisterProjectBody } from '../../types/project';
import { validateProjectInput } from '../../utils/validation';
import { getRelativePath } from '../../utils/format';

// 프로젝트 생성
export const createProjectHandler: RequestHandler<unknown, BasicResponse> = async (req, res) => {
  await createProject(req, res);
};

const createProject = async (req: Request<unknown, BasicResponse>, res: Response<BasicResponse>) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({
        message: '토큰 검증 실패'
      });
    }

    const reqBody = JSON.parse(req.body.data) as RegisterProjectBody;

    const validationResult = validateProjectInput(reqBody);

    if (!validationResult.valid) {
      return res.status(400).json({ message: validationResult.message || '' });
    }

    const projectId = req.body.projectId ? BigInt(req.body.projectId) : null;
    const contestId = BigInt(reqBody.contestId);
    const filteredSkills = validationResult.filteredSkills || [];
    const filteredMembers = validationResult.filteredMembers || [];

    const { projectName, authorCategory, teamName, introduction, description, startDate, endDate } = reqBody;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const image = files?.['image'] ? files?.['image'][0] : null;
    const video = files?.['video'] ? files?.['video'][0] : null;
    const imageUri = image ? getRelativePath(image.path) : null;
    const videoUri = video ? getRelativePath(video.path) : null;

    const contest = await prisma.contest.findUnique({
      where: { id: contestId }
    });

    if (!contest) {
      return res.status(404).json({
        message: '해당 대회를 찾을 수 없습니다.'
      });
    }

    if (authorCategory === Author.TEAM && !teamName) {
      return res.status(400).json({
        message: '팀 프로젝트인 경우 팀 이름은 필수입니다.'
      });
    }

    const data = {
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
      video: videoUri
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
      if (filteredMembers.length) {
        const memberData = filteredMembers.map((m) => ({
          studentId: m.studentId,
          projectId: projectResult.id
        }));
        await tx.member.createMany({ data: memberData });
      }
    });
    return res.status(201).json({
      message: '프로젝트가 성공적으로 생성되었습니다.'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
