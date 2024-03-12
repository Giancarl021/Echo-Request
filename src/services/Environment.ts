import 'dotenv/config';
import { mkdirSync } from 'fs';
import constants from '../util/constants.js';
import locate from '../util/locate.js';
import Logger from './Logger.js';

const logger = Logger('services:Environment');

logger.debug('Creating necessary directories...');

for (const directory of constants.environment.requiredDirectories) {
    const path = locate(directory);
    mkdirSync(path, { recursive: true });
}
