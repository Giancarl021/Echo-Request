import type AnyRecord from '../interaces/AnyRecord.js';

export function size(object: object) {
    return Object.keys(object).length;
}

export function stringify<T extends AnyRecord>(
    object: T
): Record<string, string> {
    const result: Record<string, string> = {};
    for (const key in object) {
        result[String(key)] = String(object[key]);
    }

    return result;
}

export function pick<T extends AnyRecord, K extends keyof T>(
    object: T,
    keys: K[]
): Pick<T, K> {
    const result = {} as Pick<T, K>;

    for (const key of keys) {
        if (!object.hasOwnProperty(key)) throw new Error('Picked invalid key');
        result[key] = structuredClone(object[key]);
    }

    return result;
}

export function merge<T extends AnyRecord, S extends AnyRecord>(
    objectA: T,
    objectB: S
): T & S {
    return {
        ...structuredClone(objectA),
        ...structuredClone(objectB)
    };
}
