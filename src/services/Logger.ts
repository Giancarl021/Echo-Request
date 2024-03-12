import chalk from 'chalk';
import { isText } from 'istextorbinary';
import { LogLevelValues } from '../interaces/LogLevel.js';
import constants from '../util/constants.js';
import { repeat } from '../util/string.js';

import type LogLevel from '../interaces/LogLevel.js';
import type RequestInfo from '../interaces/RequestInfo.js';
import type KeyOfType from '../interaces/KeyOfType.js';

type LogFunction<Level extends LogLevel> = (
    message: Level extends 'data' ? RequestInfo : string
) => void;

type Color = KeyOfType<typeof chalk, () => {}>;

const EMPTY_LOGGER = () => void 0;
const MAX_LOG_LEVEL_LENGTH = Math.max(
    ...LogLevelValues.map(level => level.length)
);

const logLevelIndex = LogLevelValues.indexOf(constants.logging.level);

export type LoggerInstance = ReturnType<typeof Logger>;

export default function Logger(namespace: string) {
    const _namespace = namespace;

    function _now() {
        return new Date().toISOString();
    }

    function _getEmptyLogger<Level extends LogLevel>() {
        return EMPTY_LOGGER as LogFunction<Level>;
    }

    function _getLevelColor(logLevel: LogLevel) {
        const base = logLevel.toUpperCase().padEnd(MAX_LOG_LEVEL_LENGTH, ' ');
        let result: string;

        switch (logLevel) {
            case 'error':
                result = chalk.redBright(base);
                break;
            case 'warn':
                result = chalk.yellowBright(base);
                break;
            case 'info':
                result = chalk.blueBright(base);
                break;
            case 'debug':
                result = chalk.gray(base);
                break;
            case 'data':
                result = chalk.bgGreenBright(chalk.black(base));
                break;
            case 'none':
                result = chalk.bgGray(base);
                break;
            default:
                result = base;
        }

        return result;
    }

    function _formatMethod(method: RequestInfo['method']) {
        let result: string;
        switch (method.toUpperCase()) {
            case 'GET':
                result = chalk.greenBright(method);
                break;
            case 'POST':
                result = chalk.yellowBright(method);
                break;
            case 'PUT':
                result = chalk.magentaBright(method);
            case 'PATCH':
                result = chalk.magenta(method);
                break;
            case 'DELETE':
                result = chalk.redBright(method);
                break;
            case 'OPTIONS':
                result = chalk.cyan(method);
                break;
            case 'HEAD':
                result = chalk.cyanBright(method);
                break;
            default:
                result = chalk.gray(method);
        }

        return result;
    }

    function _formatBody(body: RequestInfo['body'], contentType?: string) {
        if (!contentType || contentType === 'application/octet-stream')
            return chalk.bgGray(chalk.whiteBright('<binary>'));

        const data = body.toString('utf8');
        let result: string;

        switch (contentType) {
            case 'application/json':
                result = chalk.whiteBright(
                    JSON.stringify(JSON.parse(data), null, 2)
                );
                break;
            case 'multipart/form-data':
                result = chalk.bgGray(chalk.whiteBright('<binary>'));
                break;
            default:
                if (isText(null, body)) {
                    result = chalk.white(data);
                } else {
                    result = chalk.bgGray(chalk.whiteBright('<binary>'));
                }
        }

        return result;
    }

    function _formatDictionary(
        dictionary: RequestInfo['query'] | RequestInfo['headers'],
        keyColor: Color,
        valueColor: Color
    ) {
        const lines: string[] = [];

        for (const key in dictionary) {
            lines.push(
                `${chalk[keyColor](key + ':')} ${chalk[valueColor](dictionary[key])}`
            );
        }

        return lines.join('\n');
    }

    function _getMessage(message: string | RequestInfo) {
        if (typeof message === 'string') return chalk.white(message);

        const margin = chalk.bgWhiteBright(chalk.black(repeat('-', 15)));

        return `[RequestInfo]\n${margin}\n\n${_formatMethod(message.method)} ${chalk.white(message.path)}\n\n${chalk.greenBright('Query:')}\n${_formatDictionary(message.query, 'greenBright', 'green')}\n\n${chalk.blueBright('Headers:')}\n${_formatDictionary(message.headers, 'blueBright', 'blue')}\n\n${chalk.whiteBright('Body:')}\n${_formatBody(message.body, message.headers['content-type'])}\n\n${margin}\n`;
    }

    function _createLogger<Level extends LogLevel>(
        logLevel: Level
    ): LogFunction<Level> {
        const logIndex = LogLevelValues.indexOf(logLevel);

        if (logIndex < logLevelIndex) return _getEmptyLogger<Level>();

        const level = _getLevelColor(logLevel);

        return function log(
            message: Level extends 'data' ? RequestInfo : string
        ) {
            const timestamp = chalk.greenBright(`[${_now()}]`);
            const namespace = chalk.whiteBright(`(${_namespace})`);
            const _message = _getMessage(message);

            console.log(`${timestamp} ${namespace} ${level} ${_message}`);
        };
    }

    function createChildLogger(namespace: string): LoggerInstance {
        return Logger(`${_namespace}:${namespace}`);
    }

    return {
        debug: _createLogger('debug'),
        info: _createLogger('info'),
        warn: _createLogger('warn'),
        error: _createLogger('error'),
        data: _createLogger('data'),
        createChildLogger
    };
}
