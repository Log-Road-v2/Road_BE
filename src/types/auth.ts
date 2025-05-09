import { Role } from '../config/prisma';

export interface SignUpRequest {
  role: Role;
  email: string;
  password: string;
  name: string;
  grade?: string;
  classNumber?: string;
  studentNumber?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  role: Role;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface SendMailRequest {
  email: string;
}

export interface PasswordModifyRequest {
  email: string;
  code: string;
  newPassword: string;
}
