export const getRelativePath = (fullPath: string) => {
  const index = fullPath.indexOf('uploads');
  return index !== -1 ? '/' + fullPath.slice(index) : fullPath;
};
