const { Sequelize, DataTypes} = require('sequelize');  //to interact with the database with the use of any sql query using objects
const koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const jwt = require('jsonwebtoken');
const koajwt = require('koa-jwt');
const app = new koa();
const router = new Router();
const bcrypt = require('bcryptjs')
require('dotenv').config();
JWT_SECRECT = process.env.JWT_SECRECT;
const sequelize = new Sequelize(process.env.DB_name, process.env.DB_username, process.env.DB_password, {
  host: process.env.DB_host,
  port: process.env.DB_port,
  dialect: 'postgres',
  logging: false,
});

//make a data model without using SQL Query
const User = sequelize.define('User',{
  id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey:true
  },
  username:{
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  email:{
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }

},{
  timestamps: true
});

async function syncDatabase(){
  await sequelize.sync({
    alter: true
  })
};

app.use(bodyParser());

//define router and their actions
router.post('/register', async (ctx) =>{
  let { username, password, email } = ctx.request.body;
  const user = await checkUser(username);
  const checkemail = await checkEmail(email);
  if(user || checkemail)
    {
      ctx.status = 400;
      ctx.body = {message: "Username or Email already exists"}
      return;
    }
    password = await hashPassword(password);
  const newUser = User.create({username, password, email});
  ctx.status = 201;
  await syncDatabase();
  ctx.body = {message: "User created successfully"}
    console.log('user created successfully');
});

// login user
router.post('/login', async (ctx) =>{
  const { username, password } = ctx.request.body;
  const user = await User.findOne({where: {username}});
  if(user.username === username && await checkPassword(password, user)) {
    const payload = {username: User.username, email: User.email} 
    const token = jwt.sign(payload , JWT_SECRECT, {expiresIn: '1h'});
    ctx.status = 200;
    ctx.body = {message: "Login successful",
      token: token
    };
    return;
  }

    ctx.body ={ message: "Invalid Credentials",};
    ctx.status = 400;
    return;
});

// delete user data
router.delete('/delete', async (ctx) =>{
  const {username} = ctx.request.body;
  const user = await checkUser(username);
  if(!user){
   ctx.body = {message: `User ${username} doesnot exists`};
   ctx.status = 404;
   return;
  }
  await User.destroy({where: {username}});
  ctx.status = 201;
  await syncDatabase();
  ctx.body = {message: `User:${username} deleted successfully`};
  console.log('user deleted succesfully');
});

// update the password
router.put('/updatepassword', async (ctx) => {
  const {username , email, password} = ctx.request.body;
  let{newpassword} = ctx.request.body;
  let user = await checkUser(username);
  if(!user){
    ctx.body = {message:"User doesnot exists"}
    return;
  }
  user = User.findOne({where: {username}});
   const checkpassword = await checkPassword(password,user);
   if(!checkpassword)
   {
    ctx.body = {message:"Old password is Incorrect"}
   }
   newpassword = await hashPassword(newpassword);
   await User.update({password: newpassword},{where: {username: username}});
   await syncDatabase();
   ctx.body = {message: 'Password updated successfully'}
})

//update user email and password
router.put('/updateemail', async (ctx) =>{
  let {username, email, password, newusername , newemail} = ctx.request.body;
  let user = await checkUser(username);
  if(!user){
    ctx.body = {message:"User doesnot exists"}
    return;
  }
  const checkUsername = await checkUser(newusername);
  const checkmail = await checkEmail(newemail);
  if(checkmail){
    console.log(checkmail);
    ctx.body = {message: "email already exists"};
    return;
  }
  await User.update({email:newemail}, {where:{username}});
  await syncDatabase();
  ctx.body = {message: `Email Updated successfully 
    New E-mial: ${newemail}`};
});

//update username
router.put('/updateusername', async (ctx) =>{
  const {username, email, password ,newusername} = ctx.request.body;
  const check = await checkUser(username);
  if(!check){
    ctx.status = 404;
    ctx.body = {
      message:"user doesnot exists"
    };
    return;
  }
  const checkusername= await  checkUser(newusername);
  if(!checkusername)
  {
    await User.update({username:newusername},{where:{username}})
    ctx.status = 201;
    ctx.body = {message:`Username change to '${newusername}' successfully `}
    return;
  };
  console.log(checkusername)
  ctx.body={message:"Username already exists"};
})

//checks if the username exists or not
async function checkUser(username){
  console.log(username)
 const user = await User.findOne({where: {username} });
 if(user){
  return !!user;
 } 
 return false;
}

//check if the email exists or not
async function checkEmail(email){
  console.log(email)
  const userEmail = await User.findOne({where:{email}});
 if(userEmail){
  return !!userEmail;
 }
 return false;
}

//hash the password for security
async function hashPassword(password){
  const hashedPassword = await bcrypt.hash(password,10);
  console.log(hashedPassword);
  return (hashedPassword);
}

//check password
async function checkPassword(password,user){
   const check = await bcrypt.compare(password,user.password);
   console.log(check);
   return check;
}

//middleware
const auth = koajwt({ secret: JWT_SECRECT }).unless({
  path: ['/public', '/login', '/register'], // Paths that don't require authentication
});
app.use(auth); // Use JWT middleware

//main app 
app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);