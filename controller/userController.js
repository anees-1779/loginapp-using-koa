import {User} from '../models/userModel.js';
import { hashedPassword, checkPassword } from '../lib/hashpassword.js';
import {sendMail} from '../lib/otpmail.js'
import { otp } from '../lib/otp.js';
import { tokenVerify } from '../lib/jwtVerification.js';
import multer from 'koa-multer';
import path from 'path';
// Update the password 
const updatePassword = async (ctx) => {
  try {
    const username = await tokenVerify(ctx);
    console.log(username);
    const {newpassword,password} = ctx.request.body;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      ctx.status = 404;
      ctx.body = { message: "User does not exist" };
      return;
    }
    const isPasswordValid =await checkPassword(password, user.password);
    if (!isPasswordValid) {
      ctx.status = 400;
      ctx.body = { message: "Old password is incorrect" };
      return;
    }
    const Password =await hashedPassword(newpassword);
    await User.update({ password: Password }, { where: { username } });
    ctx.status = 200;
    ctx.body = { message: "Password updated successfully" };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { message: "Internal server error", error: err.message };
  };
};

// Update email
const updateEmail = async (ctx) => {
  try {
    const { newemail } = ctx.request.body;
    const token = ctx.headers.authorization?.split(' ')[1];;
    const decoded = jwt.verify(token, JWT_SECRECT);
    const username = decoded.username;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      ctx.status = 404;
      ctx.body = { message: "User does not exist" };
      return;
    }

    const existingEmail = await User.findOne({ where: { email: newemail } });
    if (existingEmail) {
      ctx.status = 400;
      ctx.body = { message: "Email already exists" };
      return;
    }

    await User.update({ email: newemail }, { where: { username } });
    ctx.status = 200;
    ctx.body = { message: `Email updated successfully to ${newemail}` };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { message: "Internal server error", error: err.message };
  };
};

// Update username
const updateUsername = async (ctx) => {
  try {
    const {  newusername } = ctx.request.body;
    const token = ctx.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRECT);
    const username = decoded.username;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      ctx.status = 404;
      ctx.body = { message: "User does not exist" };
      return;
    }

    const existingUsername = await User.findOne({ where: { username: newusername } });
    if (existingUsername) {
      ctx.status = 400;
      ctx.body = { message: "Username already exists" };
      return;
    }

    await User.update({ username: newusername }, { where: { username } });
    ctx.status = 200;
    ctx.body = { message: `Username updated successfully to ${newusername}` };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { message: "Internal server error", error: err.message };
  };
};

// Delete user
const deleteUser = async (ctx) => {
  try {
    const token = ctx.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRECT);
    console.log(decoded);
    const username = decoded.username;
    console.log(username);
    const user = await User.findOne({ where: { username } });
    if (!user) {
      ctx.status = 404;
      ctx.body = { message: `User ${username} does not exist` };
      return;
    }

    await User.destroy({ where: { username } });
    ctx.status = 200;
    ctx.body = { message: `User ${username} deleted successfully` };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { message: "Internal server error", error: err.message };
  };
};

//TO RESET PASSWORD
const OTPresetPassword = async (ctx) =>{
  const { username , email } = ctx.request.body;
  const user = await User.findOne({where: {username: username}});
  try{
    if(!user){
      ctx.status = 404;
      ctx.body = {
        message: "User doesnot exist"
      };
      return;
    }
    if(user.email != email){
      ctx.status = 400;
      ctx.body = {
        message: "Your username doesnot match the email address with the account"
      }
      return;
    }
    const newResetedPass = otp();
    console.log(newResetedPass);
    sendMail(email, newResetedPass);
    await User.update({otp: newResetedPass}, {where: {username:username}})
    ctx.status = 200;
    ctx.body = {
      message: "OTP sent to email successfully"
    }
 
  }
  catch(error){
    ctx.status = 500;
    ctx.body = {
      message: "Password changing operations failed",
      error: error.message
    }
  };
};

const resetPassword = async (ctx) => {
  try{
    const { username , email, otp , newpassword } = ctx.request.body;
    const user = await User.findOne({where: {username: username}});
    if(!user){
      ctx.status = 404;
      ctx.body = {
        message: "User doesnot exist"
      };
      return;
    }
    else if(user.email != email){
      ctx.status = 400;
      ctx.body = {
        message: "Your username doesnot match the email address with the account"
      }
      return;
    }
    console.log(user.otp);
    if(otp == user.otp && user.otp != null){
      const hashedPassword = await hashPassword(newpassword);
      console.log(hashedPassword);
      await User.update({password: hashedPassword}, {where: { username: username}});
      await User.update({otp: null}, {where: {username: username}})
      ctx.status = 200;
      ctx.body = {
        message:`Password reset successful`
      };
      return;
    }
    ctx.status = 404;
    ctx.body = {
      message: "Your OTP is incorrect please try again"
    }
  }
  catch(error){
    ctx.status = 500;
    ctx.body = {
      message: error
    }
  };
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    //save the original file extension
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

const uploadPicture = async (ctx) => {
  try {
    const file = ctx.req.file;

    if (!file) {
      ctx.status = 404;
      ctx.body = {
        message: 'No file uploaded',
      };
      return;
    }
    console.log(file);

    ctx.status = 202;
    ctx.body = {
      message: 'File uploaded successfully',
      fileInfo: {
        originalname: file.originalname,
        mimetype: file.mimetype,
        path: file.path,
        size: file.size,
      },
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      message: 'Upload operation failed',
      error: error.message,
    };
  }
};



export {
  updatePassword,
  updateEmail,
  updateUsername,
  deleteUser,
  resetPassword, 
  OTPresetPassword,
  uploadPicture,
  upload
};
