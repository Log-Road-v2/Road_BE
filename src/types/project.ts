import { Author, ProjectState } from '../config/prisma'

export interface StudentResponse {
  studentId: bigint
  name?: string
}

export interface ProjectBase {
  projectId: bigint | null
  contestId: bigint
  projectName: string
  authorCategory: Author
  teamName?: string | null
  skills: string
  members: StudentResponse[]
  introduction: string
  description: string
  startDate: Date | string
  endDate: Date | string
  image: string
  video: string
}

export interface RegisterProjectBody {
  projectId: bigint | null,
  contestId: number
  projectName: string
  authorCategory: Author
  teamName: string | null
  skills: Array<string>
  members: StudentResponse[]
  introduction: string
  description: string
  startDate: Date | string
  endDate: Date | string
  image: string
  video: string
}

export interface ModifyProjectRequest extends ProjectBase {
  projectId: bigint
}

export interface ProjectResponse {
  id: string
  projectName: string
  authorCategory: Author
  introduction: string | null
  image: string | null
  isMark: boolean | null
}

export interface GetArchivesResponse {
  contestId: string
  name: string
  startDate: Date | string
  endDate: Date | string
  purpose: string | null
  offset: number
  totalProject: number
  projects: ProjectResponse[]
}

export interface GetProjectDetailResponse {
  contestName: string
  isMark: boolean | null
  isWriter: boolean
  projectName: string
  authorCategory: Author
  teamName: string | null,
  member: StudentResponse[]
  skills: Array<string>
  introduction: string | null,
  description: string | null,
  startDate: Date | string
  endDate: Date | string
  image: string | null,
  video: string | null,
  state: ProjectState
}

export interface GetDraftProjectResponse {
  contestId: string
  projectName: string
  authorCategory: Author
  teamName: string | null
  skills: string | null
  members: StudentResponse[]
  introduction: string | null
  description: string | null
  startDate: Date | string
  endDate: Date | string
  image: string | null
  video: string | null
}

export interface SearchProjectParam {
  keyword: string
  offset: number
}

export interface SearchProjectResponse {
  offset: number
  totalProject: number
  projects: ProjectResponse[]
}

export interface SearchKeywordQuery {
  keyword: string
}

export interface SearchStudentResponse {
  students: StudentDetail[]
}

export interface StudentDetail {
  studentId: string
  name: string
  grade: number | null
  classNumber: number | null
  studentNumber: number | null
}

export interface ProjectIdParam {
  projectId: bigint
}

export interface GetArchivesParam {
  contestId: bigint,
  offset: number
}

export interface ValidationSuccess {
  valid: true;
  filteredSkills: string[];
  filteredMembers: { studentId: bigint }[];
}

export interface ValidationFailure {
  valid: false;
  message: string;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;