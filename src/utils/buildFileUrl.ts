const IMAGE_SERVER_URL = process.env.IMAGE_SERVER_URL;
if (!IMAGE_SERVER_URL) {
  throw Error('image server url get failed from env');
}

export const buildFileUrl = (imagePath: string | null): string | null => {
  return imagePath ? `${IMAGE_SERVER_URL}${imagePath}` : null;
};
