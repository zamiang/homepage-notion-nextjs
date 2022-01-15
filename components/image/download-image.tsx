import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { Params } from '../../pages/photos/[id]';
import { IDatabase } from '../../pages/writing';

const getFilename = (url: string) => {
  try {
    return new URL(url).pathname.split('/').pop();
  } catch (e) {
    console.error(e);
  }
};

const directoryExists = (path: string) => {
  try {
    return fs.existsSync(path);
  } catch {
    return false;
  }
};

const getFile = (url: string) => {
  try {
    return axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });
  } catch (e) {
    console.log('error', e);
  }
};

export const downloadImage = async (url: string, pageId: string) => {
  const fileName = getFilename(url);
  const dest = `/Users/brennanmoore/homepage-notion-nextjs/public/images/${pageId}/${fileName}`;

  try {
    const dirname = path.dirname(dest);
    const doesExist = directoryExists(dirname);
    if (!doesExist) {
      fs.mkdirSync(dirname);
    }

    const file = await getFile(url);
    const download = fs.createWriteStream(dest);
    return await new Promise((resolve) => {
      file?.data.pipe(download);
      download.on('close', resolve);
      download.on('error', console.error);
    });
  } catch (err) {
    console.log(err, '<<<<');
  }
};

const shouldSaveImages = process.env.SHOULD_SAVE_IMAGES;

export const saveImagesForBlocks = async (blocks: Params['blocks'], id: string) => {
  if (shouldSaveImages === 'true') {
    const images = blocks
      .filter((b) => b.type === 'image')
      .map((block) => {
        const value = (block as any)['image'];
        return value.type === 'external' ? value.external.url : value.file.url;
      });

    await Promise.all(images.map((i) => downloadImage(i, id)));
  }
};

export const saveImagesForDatabase = async (entries: IDatabase, id: string) => {
  if (shouldSaveImages === 'true') {
    const images = entries
      .map((entry) => {
        const url = (entry.properties.Cover as any)?.files[0]?.file.url;
        return url;
      })
      .filter(Boolean);

    await Promise.all(images.map((i) => downloadImage(i, id)));
  }
};
