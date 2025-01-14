import Router from'koa-router';
const userRouter = new Router();
import {updateEmail, updatePassword, updateUsername, deleteUser} from '../controller/userController.js';
userRouter.put('/updatepassword', updatePassword);
userRouter.put('/updateemail', updateEmail);
userRouter.put('/updateusername', updateUsername);
userRouter.delete('/delete', deleteUser);

export {userRouter};