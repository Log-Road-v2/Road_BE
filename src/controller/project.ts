import express, { Request, Response } from 'express'
import project from '../service/project'
import { apiLimit, getApiLimit } from '../middleware/limit'
import { verifyJWT } from '../middleware/jwt';
import { AuthenticatedRequest } from '../types';

const router = express.Router();

router.get('/search', apiLimit, (req: AuthenticatedRequest, res: Response) => {
  project.searchProject(req, res)
});

router.post('/', apiLimit, verifyJWT, (req: Request, res: Response) => {
  project.createProject(req, res);
});

router.get('/detail/:projectId', apiLimit, (req: AuthenticatedRequest, res: Response) => {
  project.getProjectDetail(req, res);
});

router.get('/student', apiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
    project.searchStudent(req, res);
  }
);

router.patch('/:projectId', apiLimit, verifyJWT, (req: Request, res: Response) => {
  project.updateProject(req, res);
});


router.post('/storage', apiLimit, verifyJWT, (req: Request, res: Response) => {
  project.tempSaveProject(req, res);
});


router.get('/storage/:projectId', apiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  project.loadTempSavedProject(req, res)
});

router.post('/:projectId/mark', apiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  project.toggleProjectBookmark(req, res);
});

router.get('/:contestId', getApiLimit, (req: AuthenticatedRequest, res: Response) => {
  project.getArchives(req, res);
});

export default router;