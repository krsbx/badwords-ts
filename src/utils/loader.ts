import path from 'path';
import fs from 'fs-extra';
import appRootPath from 'app-root-path';
import { DIR_PATH, SETTINGS_NAME } from './constant';
import type { SettingsInfo, SettingsStructures } from './interface';

export const wordBankLoader = (dirInfo: string[]) => {
  if (!fs.existsSync(`${appRootPath.path}/${SETTINGS_NAME}`)) return [];

  try {
    const settings: SettingsStructures = fs.readJSONSync(`${appRootPath.path}/${SETTINGS_NAME}`);

    const list: string[] = dirInfo
      .map((fileName) => {
        try {
          const wordBank = fs.readJSONSync(path.resolve(DIR_PATH, fileName));

          if (Array.isArray(wordBank)) {
            return wordBank;
          }

          if (typeof wordBank === 'object') {
            const isDict = typeof settings[fileName] === 'object';
            const wordsPath = isDict
              ? (settings[fileName] as SettingsInfo).wordsPath
              : 'words' ?? 'words';

            return wordBank[wordsPath] ?? [];
          }

          // eslint-disable-next-line no-empty
        } catch {}

        return [];
      })
      .flat(1);

    return list;
  } catch {
    return [];
  }
};
