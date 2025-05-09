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

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends TokenResponse {
  role: Role;
}

export interface SendMailRequest {
  email: string;
}

export interface PasswordModifyRequest {
  email: string;
  code: string;
  newPassword: string;
}
