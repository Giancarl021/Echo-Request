import type { Request, Response } from 'express';
import type RequestInfo from '../interaces/RequestInfo.js';
import Logger from '../services/Logger.js';
import { database } from '../services/Database.js';
import { stringify } from '../util/object.js';

const logger = Logger('controllers:request');

export default async function requestController(
    request: Request,
    response: Response
) {
    logger.info('Request received');

    const query = stringify(request.query);
    const headers = stringify(request.headers);

    const info: RequestInfo = {
        query,
        headers,
        body: request.body,
        path: request.path.replace(/^\/request/, ''),
        method: request.method
    };

    logger.data(info);
    database.saveRequest(info);

    return response.json(info);
}
