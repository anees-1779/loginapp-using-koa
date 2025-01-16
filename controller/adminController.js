import { User } from "../models/userModel.js";

//TO GET ALL THE USERS INFO FROM THE DB
const getUsersInfo = async (ctx) =>{
  try{
         const user = await User.findAll();
        ctx.status = 200;
        ctx.body = {user};
    }
    catch(error){
      ctx.status = 400;
      ctx.body = {
        message: "No table found"
      }
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
  console.log(CNE,CNU);
  await User.update({email: newEmail, username: newUsername},{where :{id: id}});
  ctx.body = {
    message:'User Updated'
  }
};

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


export {getUsersInfo, deleteUser, updateUser};

