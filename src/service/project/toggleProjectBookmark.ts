import { prisma } from '../../config/prisma';
import { BasicResponse } from '../../types';
import { Request, RequestHandler, Response } from 'express';
import { ProjectIdParam } from '../../types/project';

// 북마크

export const toggleProjectBookmarkHandler: RequestHandler<ProjectIdParam> = async (req, res) => {
  await toggleProjectBookmark(req, res);
};

const toggleProjectBookmark = async (req: Request<ProjectIdParam, unknown>, res: Response<BasicResponse>) => {
  try {
    const rawProjectId = req.params.projectId;

    if (!req.userId) {
      return res.status(400).json({ message: '토큰 검증 실패' });
    }

    if (!rawProjectId) {
      return res.status(400).json({ message: '프로젝트 아이디가 유효하지 않습니다.' });
    }

    const userId = BigInt(req.userId);
    const projectId = BigInt(rawProjectId); 

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return res.status(404).json({ message: '요청한 정보가 존재하지 않습니다.' });
    }

    const existingBookmark = await prisma.mark.findUnique({
      where: { projectId_userId: { projectId, userId } }
    });

    if (existingBookmark) {
      await prisma.mark.delete({ where: { projectId_userId: { projectId, userId } } });
      return res.status(200).json({ message: '북마크 해제 완료' });
    } else {
      await prisma.mark.create({ data: { projectId, userId } });
      return res.status(201).json({ message: '북마크 추가 완료' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
