import express from 'express'
import project from '../service/project'
import { apiLimit, getApiLimit } from '../middleware/limit'
import { verifyJWT } from '../middleware/jwt';

const app = express.Router();

app.get('/search', getApiLimit, project.searchProjectHandler)
app.post('/', verifyJWT, apiLimit, project.createProjectHandler)
app.get('/detail/:projectId', getApiLimit, project.getProjectDetailHandler)
app.get('/student', verifyJWT, getApiLimit, project.searchStudentHandler)
app.patch('/:projectId', verifyJWT, apiLimit, project.updateProjectHandler)
app.post('/storage', verifyJWT, apiLimit, project.tempSaveProjectHandler)
app.get('/storage/:projectId', verifyJWT, getApiLimit, project.loadTempSavedProjectHandler)
app.post('/:projectId/mark', verifyJWT, apiLimit, project.toggleProjectBookmarkHandler)
app.get('/:contestId', getApiLimit, project.archivesHandler)

export default app;