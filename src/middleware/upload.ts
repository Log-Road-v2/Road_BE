import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

const baseUploadPath = path.join(__dirname, '../../uploads');
const imageUploadPath = path.join(baseUploadPath, 'image');
const videoUploadPath = path.join(baseUploadPath, 'video');

const ensureDirExist = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    let uploadPath = '';
    if (file.mimetype.startsWith('image/')) {
      uploadPath = imageUploadPath;
    } else if (file.mimetype.startsWith('video/')) {
      uploadPath = videoUploadPath;
    } else {
      uploadPath = baseUploadPath;
    }

    ensureDirExist(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    const timestamp = Date.now();
    const randomNum = Math.round(Math.random() * 1e9);
    cb(null, `${name}_${timestamp}_${randomNum}${ext}`);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-matroska', 'video/webm'];

  if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        '지원하지 않는 파일 형식입니다. 이미지(jpeg, png, gif, webp) 또는 영상(mp4, mov, mkv, webm)만 허용됩니다.'
      )
    );
  }
};

const MAX_FILE_SIZE = 100 * 1024 * 1024;

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});
