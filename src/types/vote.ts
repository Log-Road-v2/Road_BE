import { Author } from '../config/prisma';

export interface voteListResponse {
  contestId: string;
  name: string;
  awards: Award[];
  projects: Project[];
}

interface Award {
  name: string;
}

export interface Project {
  id: string;
  projectName: string;
  authorCategory: Author;
  introduction: string;
  image: string;
}

export interface MyVoteResponse {
  contestId: bigint;
  project: MyVoteProject[];
}

interface MyVoteProject {
  id: bigint;
  projectId: number;
  rank: number;
}

export interface VoteItem {
  projectId: bigint;
  rank: number;
}

export type VoteResponse = VoteItem[];
