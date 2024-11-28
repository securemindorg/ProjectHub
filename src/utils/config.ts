import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface Config {
  dataPath: string;
}

const CONFIG_FILE = 'config.json';
let config: Config | null = null;

export const configManager = {
  init: (dataPath: string) => {
    try {
      writeFileSync(CONFIG_FILE, JSON.stringify({ dataPath }, null, 2));
      config = { dataPath };
      return true;
    } catch (error) {
      console.error('Failed to initialize config:', error);
      return false;
    }
  },

  load: (): Config | null => {
    if (config) return config;

    try {
      const data = readFileSync(CONFIG_FILE, 'utf8');
      config = JSON.parse(data);
      return config;
    } catch (error) {
      return null;
    }
  },

  getDataPath: (): string | null => {
    const cfg = configManager.load();
    return cfg?.dataPath || null;
  },
};