import { userRouter } from '@modules/user/infra/http/routes/user.routes';
import { Router } from 'express';

const routes = Router();

routes.use(userRouter);

export { routes };
