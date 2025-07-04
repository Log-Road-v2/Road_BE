import { Author } from '../config/prisma';

export interface MyVoteItem {
  id: number;
  projectId: string;
  rank: number;
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
  image: string | null;
}

export interface VoteItem {
  projectId: string;
  rank: number;
}

export interface VoteRequest {
  votes: VoteItem[];
}
