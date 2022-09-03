import fs from 'fs-extra';
import appRootPath from 'app-root-path';
import { array as baseList } from 'badwords-list';
import { DIR_PATH, SETTINGS_NAME } from './utils/constant';
import { jsonDownloader } from './utils/downloader';
import { wordBankLoader } from './utils/loader';
import type { SettingsInfo, SettingsStructures } from './utils/interface';

class BadwordFilter {
  private _list: string[];
  private _emptyList: boolean;
  private _exclude: string[];
  private _regex: RegExp;
  private _splitRegex: RegExp;
  private _replaceRegex: RegExp;
  private _placeHolder: string;

  // eslint-disable-next-line no-use-before-define
  private static _instance: BadwordFilter;

  private constructor() {
    this._list = [...baseList];
    this._emptyList = false;
    this._exclude = [];
    this._placeHolder = '*';
    this._regex = /[^a-zA-Z0-9|$|@]|\^/g;
    this._splitRegex = /\b/;
    this._replaceRegex = /\w/g;
  }

  public get emptyList() {
    return this._emptyList;
  }

  public set emptyList(emptyList: boolean) {
    this._emptyList = emptyList;
    this.list = [];
  }

  public get exclude() {
    return this._exclude;
  }

  public set exclude(exclude: string[]) {
    this._exclude = [...this._exclude, ...exclude];
  }

  public get list() {
    return this._list;
  }

  public set list(list: string[]) {
    if (this.emptyList) {
      this._list = [...list];
    } else {
      this._list = [...baseList, ...list];
    }
  }

  public get placeHolder() {
    return this._placeHolder;
  }

  public set placeHolder(placeholder: string) {
    this._placeHolder = placeholder;
  }

  public get regex() {
    return this._regex;
  }

  public set regex(regex: RegExp) {
    this._regex = regex;
  }

  public get splitRegex() {
    return this._splitRegex;
  }

  public set splitRegex(splitRegex: RegExp) {
    this._splitRegex = splitRegex;
  }

  public get replaceRegex() {
    return this._replaceRegex;
  }

  public set replaceRegex(replaceRegex: RegExp) {
    this._replaceRegex = replaceRegex;
  }

  public static get instance() {
    if (!BadwordFilter._instance) BadwordFilter._instance = new BadwordFilter();

    return BadwordFilter._instance;
  }

  public isProfane(text: string) {
    return (
      this.list.filter((word) => {
        const wordExp = new RegExp(`\\b${word.replace(/(\W)/g, '\\$1')}\\b`, 'gi');

        return !this.exclude.includes(word.toLowerCase()) && wordExp.test(text);
      }).length > 0 || false
    );
  }

  public replaceWord(text: string) {
    return text.replace(this.regex, '').replace(this.replaceRegex, this.placeHolder);
  }

  public clean(text: string) {
    return text
      .split(this.splitRegex)
      .map((word) => (this.isProfane(word) ? this.replaceWord(word) : word))
      .join(this.splitRegex.exec(text)?.[0] ?? '');
  }

  public addWords(...words: string[]) {
    this.list.push(...words);

    words
      .map((word) => word.toLowerCase())
      .forEach((word) => {
        if (this.exclude.includes(word)) this.exclude.splice(this.exclude.indexOf(word), 1);
      });
  }

  public removeWords(...words: string[]) {
    this.exclude.push(...words.map((word) => word.toLowerCase()));
  }

  public async downloadWordBank() {
    if (!fs.existsSync(`${appRootPath.path}/${SETTINGS_NAME}`)) return;

    try {
      const settings: SettingsStructures = fs.readJSONSync(`${appRootPath.path}/${SETTINGS_NAME}`);

      const keys = Object.keys(settings);

      if (!fs.existsSync(DIR_PATH)) fs.mkdirpSync(DIR_PATH);

      await Promise.all(
        keys.map(async (key) => {
          const isDict = typeof settings[key] === 'object';
          const url = isDict ? (settings[key] as SettingsInfo).url : (settings[key] as string);

          return jsonDownloader(key, url);
        })
      );

      this.loadWordBank();

      // eslint-disable-next-line no-empty
    } catch {}
  }

  public async loadWordBank() {
    if (!fs.existsSync(DIR_PATH)) return;

    const dirInfo = fs.readdirSync(DIR_PATH);

    if (dirInfo.length === 0) return;

    const list = wordBankLoader(dirInfo);

    this.list = list;
  }
}

export = BadwordFilter;
