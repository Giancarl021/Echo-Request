type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'data' | 'none';

export const LogLevelValues = [
    'debug',
    'info',
    'warn',
    'error',
    'data',
    'none'
] as const;

export default LogLevel;
