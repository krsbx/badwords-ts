export type SettingsInfo = {
  url: string;
  wordsPath: string;
};

export type SettingsStructures = Record<string, string | SettingsInfo>;
