import Router from'koa-router';
import {updateEmail, updatePassword, updateUsername, deleteUser,  resetPassword,  OTPresetPassword} from '../controller/userController.js';
import { uploadPicture, upload } from '../controller/userController.js';
const userRouter = new Router();
userRouter.put('/password', updatePassword);
userRouter.put('/update-email', updateEmail);
userRouter.put('/update-username',updateUsername);
userRouter.delete('/users', deleteUser);
userRouter.post('/reset-password',  OTPresetPassword);
userRouter.put('/reset-password', resetPassword);
userRouter.post('/upload-picture',upload.single('file'),uploadPicture);

export {userRouter};