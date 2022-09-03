import appRootPath from 'app-root-path';
import path from 'path';

export const SETTINGS_NAME = 'badwords-ts.settings.json';

export const NODE_MODULES = 'node_modules';

export const DIR_NAME = '.badwords';

export const DIR_PATH = path.resolve(appRootPath.path, NODE_MODULES, DIR_NAME);
