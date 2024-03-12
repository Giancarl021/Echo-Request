import { homedir } from 'os';
import { dirname, resolve, isAbsolute, join } from 'path';
import { fileURLToPath } from 'url';

const HOME = homedir();
const ROOT = dirname(join(fileURLToPath(import.meta.url), '..', '..'));

export default function locate(pathToFile: string, useCWD = false) {
    if (!pathToFile) throw new Error('Invalid path');

    const path = pathToFile.replace(/(~|%userprofile%|%home%)/gi, HOME);

    if (isAbsolute(path)) return path;

    return useCWD ? resolve(process.cwd(), path) : resolve(ROOT, path);
}
