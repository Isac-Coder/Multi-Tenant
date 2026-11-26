import sharp from 'sharp';

export async function createThumbnail(imageBuffer, width) {
  return sharp(imageBuffer)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .toBuffer();
}
