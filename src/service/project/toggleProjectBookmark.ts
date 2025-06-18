import { prisma } from "../../config/prisma";
import { Response } from "express";
import { AuthenticatedRequest, BasicResponse } from "../../types";

// 북마크

export const toggleProjectBookmark = async (
  req: AuthenticatedRequest,
  res: Response<BasicResponse>
) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;

    console.log("projectId:", projectId);

    if (!userId) {
      return res.status(400).json({ 
        message: '토큰 검증 실패'
       })
    }

    const project = await prisma.project.findUnique({
      where: { id : projectId },
    })

    if(!project) {
      return res.status(404).json({
        message: "요청한 정보가 존재하지 않습니다"
      })
    }

    const exciting = await prisma.mark.findUnique({
      where: {
        projectId_userId: {
          projectId: BigInt(projectId),
          userId: BigInt(userId),
        },
      },
    });

    if(exciting) {
      await prisma.mark.delete({
        where: {
          projectId_userId: {
            projectId: BigInt(projectId),
            userId: BigInt(userId),
          },
        },
      });

      return res.status(200).json({ message: "북마크 해제 완료" });
    } else {
      await prisma.mark.create({
        data: {
          projectId,
          userId: BigInt(userId),
        },
      });

      return res.status(201).json({ message: "북마크 추가 완료" });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    })
  }
}