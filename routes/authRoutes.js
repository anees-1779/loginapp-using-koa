import Router from 'koa-router';
import {registerUser, login} from '../controller/authController.js';

const authRouter = new Router();
authRouter.post('/register', registerUser);
authRouter.post('/login', login);

export {authRouter};