import Router from'koa-router';
import {updateEmail, updatePassword, updateUsername, deleteUser} from '../controller/userController.js';

const userRouter = new Router();
userRouter.put('/password', updatePassword);
userRouter.put('/update-email', updateEmail);
userRouter.put('/update-username', updateUsername);
userRouter.delete('/users', deleteUser);

export {userRouter};