import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import { DIR_PATH } from './constant';

export const jsonDownloader = async (fileName: string, url: string) => {
  const { data } = await axios.get<JSON>(url, {
    responseType: 'blob',
  });

  await fs.writeFile(path.resolve(DIR_PATH, fileName), JSON.stringify(data, null, 2));
};
