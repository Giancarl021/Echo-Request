import { LogLevelValues } from '../interaces/LogLevel.js';

import type LogLevel from '../interaces/LogLevel.js';

function getLogLevel(defaultLogLevel: LogLevel): LogLevel {
    const env = String(process.env.LOG_LEVEL).toLowerCase() as LogLevel;

    if (!env || !LogLevelValues.includes(env)) return defaultLogLevel;

    return env;
}

export default {
    server: {
        port: Math.abs(Number(process.env.PORT)) || 80
    },
    logging: {
        level: getLogLevel('info')
    },
    environment: {
        requiredDirectories: ['data']
    },
    database: {
        memoryMode: String(process.env.DB_MEMORY_MODE).toLowerCase() === 'true'
    }
} as const;
