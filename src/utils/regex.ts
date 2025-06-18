import { StudentResponse } from "../types/project";

export const checkEmailRegex = (email: string): boolean => {
  const emailPattern = /^[\w\-\.]{1,22}\@dsm.hs.kr$/;
  return emailPattern.test(email);
};

export const checkPasswordRegex = (password: string): boolean => {
  const passwordPattern = /^[\w!@#$%^&*]{8,20}$/;
  return passwordPattern.test(password);
};

export const formatDate = (date: Date) => date.toISOString().split("T")[0];

export const formatMembers = (rawMembers: any[]): StudentResponse[] => {
  return rawMembers
    .filter((m) => m.studentId !== null)
    .map((m) => ({
      studentId: m.studentId!,
      name: m.student?.name,
    }));
};