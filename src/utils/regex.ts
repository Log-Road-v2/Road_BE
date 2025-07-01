import { StudentResponse } from "../types/project";

export const checkEmailRegex = (email: string): boolean => {
  const emailPattern = /^[\w\-\.]{1,22}\@dsm.hs.kr$/;
  return emailPattern.test(email);
};

export const checkPasswordRegex = (password: string): boolean => {
  const passwordPattern = /^[\w!@#$%^&*]{8,20}$/;
  return passwordPattern.test(password);
};

export const formatDate = (date: Date | string) => date.toString().split("T")[0];

export const formatMembers = <
  T extends { studentId: unknown; student?: { name?: string } | null }
>(
  rawMembers: readonly T[],
): StudentResponse[] =>
  rawMembers
    .filter(
      (m): m is T & { studentId: string | number | bigint } =>
        m.studentId != null
    )
    .map((m) => ({
      studentId: m.studentId.toString(),
      name: m.student?.name,
    }));