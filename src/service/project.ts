import { createProjectHandler } from "./project/createProject"
import { archivesHandler } from "./project/getArchives"
import { getProjectDetailHandler } from "./project/getProjectDetail"
import { rankingHandler } from "./project/getRank"
import { loadTempSavedProjectHandler } from "./project/loadTempSavedProject"
import { searchProjectHandler } from "./project/searchProject"
import { searchStudentHandler } from "./project/searchStudent"
import { tempSaveProjectHandler } from "./project/tempSaveProject"
import { toggleProjectBookmarkHandler } from "./project/toggleProjectBookmark"
import { updateProjectHandler } from "./project/updateProject"

export default {
  createProjectHandler,
  archivesHandler,
  getProjectDetailHandler,
  loadTempSavedProjectHandler,
  searchProjectHandler,
  searchStudentHandler,
  tempSaveProjectHandler,
  toggleProjectBookmarkHandler,
  updateProjectHandler,
  rankingHandler
}