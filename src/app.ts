import express from 'express';
import routes from './routes.js';
import locate from './util/locate.js';

import type { Express } from 'express';

const app: Express = express();

app.use(express.raw({ type: '*/*' }));

app.use('/api', routes);
app.use('/', express.static(locate('src/web')));

export default app;
