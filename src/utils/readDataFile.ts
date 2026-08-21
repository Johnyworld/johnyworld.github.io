import fs from 'fs';
import path from 'path';

export const readDataFile = (relativePath: string) => {
  return fs.readFileSync(path.join(process.cwd(), relativePath), 'utf-8');
};
