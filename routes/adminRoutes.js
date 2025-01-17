import Router from "koa-router";
import { getUsersInfo } from "../controller/adminController.js";
import { deleteUser } from "../controller/adminController.js";
import { registerUser } from "../controller/authController.js";
import { updateUser } from "../controller/adminController.js";
import { middleware } from "koa-pagination";
const adminRouter = new Router();
adminRouter.get('/users', middleware(), getUsersInfo);
adminRouter.delete('/admin/:id',deleteUser);
adminRouter.post('/admin/create-user', registerUser);
adminRouter.put('/admin/update-user/:id', updateUser);

export { adminRouter };
