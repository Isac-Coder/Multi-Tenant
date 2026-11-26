import { config } from './src/config.js';
import { downloadObject, uploadObject } from './src/storage.js';
import { createThumbnail } from './src/thumbnail.js';

const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp)$/i;
const decodeKey = (rawKey) => decodeURIComponent(rawKey.replace(/\+/g, ' '));

async function processRecord(record) {
  const bucket = record.s3.bucket.name;
  const key = decodeKey(record.s3.object.key);

  if (!key.startsWith(config.originalsPrefix) || !IMAGE_EXTENSIONS.test(key)) {
    console.log(`Se ignora ${key}: no es una imagen dentro de ${config.originalsPrefix}`);
    return;
  }

  const thumbnailKey = config.thumbnailsPrefix + key.slice(config.originalsPrefix.length);
  const { body, contentType } = await downloadObject(bucket, key);
  const thumbnail = await createThumbnail(body, config.thumbnailWidth);
  await uploadObject(bucket, thumbnailKey, thumbnail, contentType);
  console.log(`Miniatura creada: ${key} -> ${thumbnailKey}`);
}

export const handler = async (event) => {
  for (const record of event.Records) {
    await processRecord(record);
  }
};