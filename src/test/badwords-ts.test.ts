import path from 'path';
import fs from 'fs-extra';
import appRootPath from 'app-root-path';
import BadwordFilter from '..';
import { SETTINGS_NAME } from '../utils/constant';

const toSeconds = (second: number) => second * 1000;

describe('badwords-ts', () => {
  beforeAll(async () => {
    const settingsPath = path.resolve(appRootPath.path, SETTINGS_NAME);

    if (fs.existsSync(settingsPath)) fs.removeSync(settingsPath);

    fs.copyFileSync(path.resolve(__dirname, SETTINGS_NAME), settingsPath);

    await BadwordFilter.instance.downloadWordBank();
    await BadwordFilter.instance.loadWordBank();
  }, toSeconds(60));

  describe('isProfane', () => {
    it('Should detect a bad word and return true', () => {
      const result = BadwordFilter.instance.isProfane('ash0le');

      expect(result).toBe(true);
    });

    it('Should detect a non bad word and return false', () => {
      const result = BadwordFilter.instance.isProfane('love');

      expect(result).toBe(false);
    });
  });

  describe('addWords', () => {
    it('Should beable to add a custom bad word', () => {
      BadwordFilter.instance.addWords('cthulhu');

      const result = BadwordFilter.instance.isProfane('cthulhu');

      expect(result).toBe(true);
    });

    it('Should censor a custom bad word', () => {
      const result = BadwordFilter.instance.clean('cthulhu');

      expect(result).toBe('*******');
    });
  });

  describe('removeWords', () => {
    it('Should beable to remove a custom bad word', () => {
      BadwordFilter.instance.removeWords('cthulhu');

      const result = BadwordFilter.instance.isProfane('cthulhu');

      expect(result).toBe(false);
    });
  });

  describe('replaceWord', () => {
    it('Should beable to replace a word to asterisks (***)', () => {
      const result = BadwordFilter.instance.replaceWord('ash0le');

      expect(result).toBe('******');
    });
  });
});
