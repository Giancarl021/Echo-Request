import { Router } from 'express';
import requestController from './controllers/requestController.js';

const routes: Router = Router();

routes.all('/request/*', requestController);

export default routes;
