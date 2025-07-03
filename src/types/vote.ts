import { Author } from '../config/prisma';

export interface myVoteItem {
  id: string;
  projectId: string;
  rank: string;
}

export interface myVoteResponse {
  project: myVoteItem[];
}

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

export interface VoteItem {
  projectId: bigint;
  rank: number;
}

export interface VoteRequest {
  votes: VoteItem[];
}