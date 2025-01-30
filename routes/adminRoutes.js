import Router from "koa-router";
import { getUsersInfo } from "../controller/adminController.js";
import { deleteUser } from "../controller/adminController.js";
import { registerUser } from "../controller/authController.js";
import { updateUser } from "../controller/adminController.js";
import { searchUser } from "../controller/adminController.js";
const adminRouter = new Router();
adminRouter.get('/users', getUsersInfo);
adminRouter.delete('/admin/:id', deleteUser);
adminRouter.post('/admin/create-user', registerUser);
adminRouter.put('/admin/update-user/:id', updateUser);
adminRouter.get('/admin/search', searchUser);

export { adminRouter };
