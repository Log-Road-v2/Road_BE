import { Author, ProjectState } from '../config/prisma';

export interface StudentResponse {
  studentId: string;
  name?: string;
}

export interface ProjectBase {
  projectId: string | null;
  contestId: string;
  projectName: string;
  authorCategory: Author;
  teamName?: string | null;
  skills: string;
  members: StudentResponse[];
  introduction: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  image: string;
  video: string;
}

export interface RegisterProjectBody {
  projectId: string | null;
  contestId: string;
  projectName: string;
  authorCategory: Author;
  teamName: string | null;
  skills: string;
  members: string;
  introduction: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  image: string;
  video: string;
}

export interface ProjectResponse {
  id: string;
  projectName: string;
  authorCategory: Author;
  introduction: string | null;
  image: string | null;
  isMark: boolean | null;
}

export interface GetArchivesResponse {
  contestId: string;
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  purpose: string | null;
  offset: number;
  totalProject: number;
  projects: ProjectResponse[];
}

export interface GetProjectDetailResponse {
  contestName: string;
  isMark: boolean | null;
  isWriter: boolean;
  projectName: string;
  authorCategory: Author;
  teamName: string | null;
  member: StudentResponse[];
  skills: Array<string>;
  introduction: string | null;
  description: string | null;
  startDate: Date | string;
  endDate: Date | string;
  image: string | null;
  video: string | null;
  state: ProjectState;
  feedback: string | null;
}

export interface GetDraftProjectResponse {
  contestId: string;
  projectName: string;
  authorCategory: Author;
  teamName: string | null;
  skills: string | null;
  members: StudentResponse[];
  introduction: string | null;
  description: string | null;
  startDate: Date | string;
  endDate: Date | string;
  image: string | null;
  video: string | null;
}

export interface SearchProjectQuery {
  [key: string]: string | undefined;
  keyword: string;
  offset: string;
}

export interface SearchProjectResponse {
  offset: number;
  totalProject: number;
  projects: ProjectResponse[];
}

export interface SearchKeywordQuery {
  [key: string]: string | undefined;
  keyword: string;
}

export interface SearchStudentResponse {
  students: StudentDetail[];
}

export interface StudentDetail {
  studentId: string;
  name: string;
  grade: number | null;
  classNumber: number | null;
  studentNumber: number | null;
}

export interface ProjectIdParam {
  [key: string]: string;
  projectId: string;
}

export interface RequestUser {
  userId: string;
}

export interface GetArchivesParam {
  [key: string]: string;
  contestId: string;
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
