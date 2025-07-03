import { Author } from '../config/prisma';

export interface MyVoteItem {
  id: string;
  projectId: string;
  rank: string;
}

export interface MyVoteResponse {
  project: MyVoteItem[];
}

export interface VoteListResponse {
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

export interface VoteItem {
  projectId: bigint;
  rank: number;
}

export interface VoteRequest {
  votes: VoteItem[];
}