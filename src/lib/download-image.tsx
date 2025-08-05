import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const getFilename = (url: string) => {
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

const fileExists = (path: string) => {
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

export const downloadImage = async (url: string) => {
  const fileName = getFilename(url);
  const dest = path.join(process.cwd(), 'public', 'images', fileName || '');

  try {
    const dirname = path.dirname(dest);
    if (!directoryExists(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
    if (fileExists(dest)) {
      return;
    }

    const file = await getFile(url);
    const download = fs.createWriteStream(dest);
    return await new Promise((resolve) => {
      file?.data.pipe(download);
      // @ts-expect-error not useful function incompatibility
      download.on('close', resolve);
      download.on('error', console.error);
    });
  } catch (err) {
    console.log(url, 'ERROR STORING THIS IMAGE', err);
  }
};
