import { RegisterProjectBody, StudentResponse, ValidationResult } from '../types/project';

const isValidDate = (date: any) => !isNaN(new Date(date).getTime());

export function validateProjectInput(body: RegisterProjectBody): ValidationResult {
  try {
    const { contestId, projectName, authorCategory, skills, members, introduction, description, startDate, endDate } =
      body;

    if (!contestId || !projectName || !authorCategory || !introduction || !description || !startDate || !endDate) {
      return { valid: false, message: `필수 입력값이 누락되었습니다` };
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return { valid: false, message: '유효하지 않은 날짜 형식입니다.' };
    }

    if (new Date(startDate) > new Date(endDate)) {
      return { valid: false, message: '시작일은 종료일보다 빠를 수 없습니다.' };
    }

    const skillsJson = JSON.parse(skills) as string[];
    const filteredSkills = skillsJson.filter((s) => s.trim().length > 0) || [];
    if (filteredSkills.length === 0) {
      return { valid: false, message: '기술 스택을 입력해주세요.' };
    }

    const member = JSON.parse(members) as StudentResponse[];
    const filteredMembers =
      member
        .filter((m) => m.studentId !== undefined)
        .map((m) => ({
          studentId: BigInt(m.studentId)
        })) || [];

    if (authorCategory === 'TEAM' && filteredMembers.length === 0) {
      return { valid: false, message: '프로젝트 멤버가 유효하지 않습니다.' };
    }

    return { valid: true, filteredSkills, filteredMembers };
  } catch (err) {
    console.error(err);
    return { valid: false, message: '오류 발생' };
  }
}
