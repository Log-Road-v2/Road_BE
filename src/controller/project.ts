import express from 'express';
import project from '../service/project';
import { apiLimit, getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { upload } from '../middleware/upload';

const app = express.Router();

app.get('/search', getApiLimit, project.searchProjectHandler);
app.get('/detail/:projectId', getApiLimit, project.getProjectDetailHandler);
app.get('/student', getApiLimit, verifyJWT, project.searchStudentHandler);
app.post(
  '/storage',
  apiLimit,
  verifyJWT,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  project.tempSaveProjectHandler
);
app.get('/storage/:projectId', getApiLimit, verifyJWT, project.loadTempSavedProjectHandler);
app.post('/:projectId/mark', apiLimit, verifyJWT, project.toggleProjectBookmarkHandler);
app.patch('/:projectId', apiLimit, verifyJWT, project.updateProjectHandler);
app.get('/rank/:contestId', getApiLimit, project.rankingHandler);
app.get('/:contestId', getApiLimit, project.archivesHandler);
app.post(
  '/',
  apiLimit,
  verifyJWT,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  project.createProjectHandler
);

export default app;
