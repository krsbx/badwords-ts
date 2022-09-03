import { array as baseList } from 'badwords-list';

const localList: string[] = [];

class BadwordFilter {
  private _list: string[];
  private _emptyList: boolean;
  private _filterList: string[];
  private _exclude: string[];
  private _regex: RegExp;
  private _splitRegex: RegExp;
  private _replaceRegex: RegExp;
  private _placeHolder: string;

  // eslint-disable-next-line no-use-before-define
  private static _instance: BadwordFilter;

  private constructor() {
    this._list = [...baseList, ...localList];
    this._emptyList = false;
    this._filterList = [];
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
    this.list = this._filterList;
  }

  public get exclude() {
    return this._exclude;
  }

  public set exclude(exclude: string[]) {
    this._exclude = exclude;
  }

  public get list() {
    return this._list;
  }

  public set list(list: string[]) {
    this._list = (this.emptyList && []) || [...localList, ...baseList, ...list];
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
}

export = BadwordFilter;
