import Router from 'koa-router';
const authRouter = new Router();
import {registerUser, login} from '../controller/authController.js';
authRouter.post('/register', registerUser);
authRouter.post('/login', login);

export {authRouter};