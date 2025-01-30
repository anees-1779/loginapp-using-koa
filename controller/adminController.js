import { User } from "../models/userModel.js";
import { UserProfiles } from "../models/userProfiles.js";
import { Sequelize } from "sequelize";

// TO GET ALL THE USERS INFO FROM THE DB
const getUsersInfo = async (ctx) => {
  try {
    const limit = ctx.query.limit ? parseInt(ctx.query.limit) : 2; 
    let offset = ctx.query.offset ? parseInt(ctx.query.offset) : 0; 
    console.log(limit, offset);
    const users = await User.findAll({
      limit,
      offset,
      include: [
        {
          model: UserProfiles,
          as: "userProfile",
        },
      ],
      order: [['id', 'ASC']]
    });
    const totalUsers = await User.count();
   ctx.body = {
      message: "Users fetched successfully",
      users,
      total: totalUsers
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
  if(!newUsername && !newEmail){
    ctx.status = 404;
    ctx.body = {
      message: "Enter what you want to change"
    }
    return; 
  }
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

//TO SEARCH USER
const searchUser = async (ctx) =>{
  const query = ctx.query.user;
  const limit = ctx.query.limit || 2;
  const offset = ctx.query.offset || 0;
  console.log(query);
  if(!query){
    ctx.status = 400;
    ctx.body = {
      message:'Please enter any info of the user you want to search in the query'
    }
    return;
  }
  try{
    const user = await User.findAll({
      where: {
        [Sequelize.Op.or]: [
          { username: { [Sequelize.Op.iLike]: `%${query}%` } },
          { email: { [Sequelize.Op.iLike]: `%${query}%` } },
          { Users_name: { [Sequelize.Op.iLike]: `%${query}%` } }
        ]
      },
      limit,
      offset,
      include: [
        {
          model: UserProfiles,
          as: "userProfile",
        }
      ],
       order: [['id', 'ASC']]
    });
    
 ctx.status = 200;
 ctx.body = {
  message: `Users retrieved successfully of following info ${query}`,
  user: user,
 }
  }
  catch(err){
    ctx.status = 400;
    ctx.body = err
  }
}

//TO CHECK IF THE EMAIL OR USERNAME EXIST OR NOT
const checkNewUsername = async (newUsername, user) => {
  if(newUsername === undefined){
    return newUsername = user.username;
  }
  const check = await User.findOne({where: {username: newUsername}});
  if(check){
    return true;
  }
  return false;
}

const checkNewEmail = async (newEmail, user)=>{
  if(newEmail === undefined){
    return newEmail = user.email;
  }
  const check = await User.findOne({where: {email: newEmail}});
  if(check){
    return true;
  }
  return false;
}

export { getUsersInfo, deleteUser, updateUser, searchUser };

