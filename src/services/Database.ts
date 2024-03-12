import SQLite3 from 'better-sqlite3';
import constants from '../util/constants.js';
import locate from '../util/locate.js';
import Logger from './Logger.js';
import { pick, merge } from '../util/object.js';

import type RequestInfo from '../interaces/RequestInfo.js';
import type {
    FlatRequestInfo,
    RequestInfoWithId
} from '../interaces/RequestInfo.js';

const logger = Logger('services:Database');

export type DatabaseInstance = ReturnType<typeof Database>;

const DB_PATH = locate('data/database.db');

export default function Database(autoMigration: boolean = false) {
    logger.debug(
        `Loading database on ${constants.database.memoryMode ? 'memory' : DB_PATH}`
    );

    const sql = SQLite3(constants.database.memoryMode ? ':memory:' : DB_PATH);
    sql.pragma('journal_mode = WAL');

    if (autoMigration) {
        logger.debug('Auto migration set to `true`');
        migrate();
    }

    const saveRequest = sql.transaction((request: RequestInfo) => {
        const { id: requestId } = sql
            .prepare<FlatRequestInfo>(
                'INSERT INTO Request (method, path, body, createdAt) VALUES (@method, @path, @body, @createdAt) RETURNING id'
            )
            .get(
                merge(pick(request, ['method', 'path', 'body']), {
                    createdAt: Date.now()
                })
            ) as RequestInfoWithId;

        each('query', request.query);
        each('headers', request.headers);

        function each<T extends keyof Pick<RequestInfo, 'query' | 'headers'>>(
            table: T,
            items: RequestInfo[T]
        ) {
            let tableName: string;

            switch (table) {
                case 'headers':
                    tableName = 'RequestHeader';
                    break;
                case 'query':
                    tableName = 'RequestQuery';
                    break;
                default:
                    throw new Error('Invalid table selected');
            }

            for (const key in items) {
                sql.prepare(
                    `INSERT INTO "${tableName}" (key, value, requestId) VALUES (@key, @value, @requestId)`
                ).run({ key, value: items[key], requestId });
            }
        }
    });

    function migrate() {
        logger.debug('Migrating database...');
        sql.exec(
            `CREATE TABLE IF NOT EXISTS Request (id INTEGER PRIMARY KEY AUTOINCREMENT, method TEXT, path TEXT, createdAt INTEGER, body BLOB)`
        );
        sql.exec(
            `CREATE TABLE IF NOT EXISTS RequestQuery (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, value TEXT, requestId INT, FOREIGN KEY (requestId) REFERENCES Request(id))`
        );
        sql.exec(`
            CREATE TABLE IF NOT EXISTS RequestHeader (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, value TEXT, requestId INT, FOREIGN KEY (requestId) REFERENCES Request(id))`);

        logger.debug('Database migrated');
    }

    function close() {
        sql.close();
    }

    return {
        migrate,
        saveRequest,
        close
    };
}

export const database: DatabaseInstance = Database(true);
