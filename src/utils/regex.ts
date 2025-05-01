export const checkEmailRegex = (email: string): boolean => {
  const emailPattern = /^[\w\-\.]{1,22}\@dsm.hs.kr$/;
  return emailPattern.test(email);
};

export const checkPasswordRegex = (password: string): boolean => {
  const passwordPattern = /^[\w!@#$%^&*]{8,20}$/;
  return passwordPattern.test(password);
};
