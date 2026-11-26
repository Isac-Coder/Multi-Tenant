const toPositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const config = {
  originalsPrefix: process.env.ORIGINALS_PREFIX || 'originals/',
  thumbnailsPrefix: process.env.THUMBNAILS_PREFIX || 'thumbnails/',
  thumbnailWidth: toPositiveInt(process.env.THUMBNAIL_WIDTH, 300),
};
