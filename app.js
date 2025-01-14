import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import {userRouter} from './routes/userRoutes.js';
import {authRouter} from'./routes/authRoutes.js';
/* const sequelize = require('./config/database'); */

const app = new Koa();
app.use(bodyParser());

// Use user routes
app.use(userRouter.routes()).use(userRouter.allowedMethods());
app.use(authRouter.routes()).use(authRouter.allowedMethods());
app.listen(3000);

