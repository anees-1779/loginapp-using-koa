import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { userRouter } from './routes/userRoutes.js';
import { authRouter } from'./routes/authRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';
import dotenv from 'dotenv';

dotenv.config();
const app = new Koa();

app.use(bodyParser());

// Use user routes
app.use(userRouter.routes()).use(userRouter.allowedMethods());
app.use(authRouter.routes()).use(authRouter.allowedMethods());
app.use(adminRouter.routes()).use(adminRouter.allowedMethods());
app.listen(3000);

export { app };
