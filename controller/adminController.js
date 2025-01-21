import { User } from "../models/userModel.js";

// TO GET ALL THE USERS INFO FROM THE DB
const getUsersInfo = async (ctx) => {
  try {
    const limit = ctx.query.limit ? parseInt(ctx.query.limit) : 10; 
    const offset = ctx.query.offset ? parseInt(ctx.query.offset) : 0;  
    const users = await User.findAll({ limit, offset });
    ctx.pagination.length = User.count();
    let count = await ctx.pagination.length ;
    console.log(count)

    ctx.body = {
      message: "Users fetched successfully",
      users,
      "total": count
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      message: "Error fetching users",
      error: error.message,
    };
  }
};


//TO DELETE A USER
const deleteUser = async (ctx) =>{
  const id = ctx.params.id;
  try{
    const user = await User.findOne({where: {id: id}});
    if(!user){
      ctx.body =  {message: "User not found"};
      return;
    }
    await User.destroy({where: {id:id}});
    ctx.status = 200;
    ctx.body = {
      message: "User Deleted Successfully"
    }
  }
  catch(error){
    ctx.status = 400;
    ctx.body = {message: error};
  }
};

//TO UPDATE A USER EMAIL OR USERNAME
const updateUser = async (ctx) =>{
  try{
  const id = ctx.params.id;
  let {newUsername, newEmail} = ctx.request.body;
  const user = await User.findOne({where :{ id: id }});
  const CNU = await checkNewUsername(newUsername, user);
  const CNE = await checkNewEmail(newEmail, user);
  if (CNU == true){
    ctx.status = 404;
    ctx.body = {
      message: "Username already exists"
    }
    return;
  }
  if (CNE == true){
    ctx.status = 404;
    ctx.body = {
      message: "Emails already exists"
    }
    return
  }
  console.log(CNE, CNU);
  await User.update({email: newEmail, username: newUsername},{where :{id: id}});
  ctx.body = {
    message:'User Updated'
  }
}catch(error){
  ctx.status = 500;
  ctx.body = {
    message:"Operation failed",
    error:err.message,
  }
}};

//TO CHECK IF THE EMAIL OR USERNAME EXIST OR NOT
 async function checkNewUsername(newUsername,user){
  if(newUsername === undefined){
    return newUsername = user.username;
  }
  const check = await User.findOne({where: {username: newUsername}});
  if(check){
    return true;
  }
  return false;
}

async function checkNewEmail(newEmail, user){
  if(newEmail === undefined){
    return newEmail = user.email;
  }
  const check = await User.findOne({where: {email: newEmail}});
  if(check){
    return true;
  }
  return false;
}

export { getUsersInfo, deleteUser, updateUser };

