import { Author, Role } from "@prisma/client"

export interface ProjectResponse {
  id: string,
  projectName: string,
  introduction: string | null,
  authorCategory: Author,
  image: string | null
}

export interface GetStudentInfoResponse {
  role: Role,
  name: string,
  email: string,
  grade: number | null,
  classNumber: number | null,
  studentNumber: number | null
}

export interface GetTeacherInfoResponse {
  role: Role,
  name: string,
  email: string
}

export interface GetBookmarkedProjectsResponse {
  offset: number
  totalProjects: number
  projects: ProjectResponse[]
}

export interface GetProjectResponse {
  projects: ProjectResponse[]
}

export interface OffsetQuery {
  [key: string]: string | undefined
  offset?: string
}

export type ProjectState = 
  | 'ALL'
  | 'PENDING'
  | 'APPROVAL'
  | 'REJECTED'
  | 'MODIFY'
  | 'WRITING';