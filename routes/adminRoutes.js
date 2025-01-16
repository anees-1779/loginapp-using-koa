import Router from "koa-router";
import { getUsersInfo } from "../controller/adminController.js";
import { deleteUser } from "../controller/adminController.js";
import { registerUser } from "../controller/authController.js";
import { updateUser } from "../controller/adminController.js";
const adminRouter = new Router();
adminRouter.get('/users', getUsersInfo);
/* adminRouter.put('/admin/:id', updateUser); */
adminRouter.delete('/admin/:id',deleteUser);
export {adminRouter};
adminRouter.post('/admin/create-user', registerUser);
adminRouter.put('/admin/update-user/:id', updateUser);
