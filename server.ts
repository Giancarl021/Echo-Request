import './src/services/Environment.js';
import app from './src/app.js';
import constants from './src/util/constants.js';
import Logger from './src/services/Logger.js';
import { database } from './src/services/Database.js';

const logger = Logger('server');

logger.debug('Initializing server...');

app.listen(constants.server.port, () =>
    logger.info(`Server listing on port ${constants.server.port}...`)
);

process.on('SIGINT', () => {
    database.close();
    process.exit();
});
