import { JWT_SECRECT } from '../config/database.js';
import {User} from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt  from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import * as otpGenerator from 'otp-generator'
import { hashPassword } from './authController.js';

// Update the password
const updatePassword = async (ctx) => {
  try {
    const token = ctx.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRECT);
    const username = decoded.username;
    const {newpassword,password} = ctx.request.body;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      ctx.status = 404;
      ctx.body = { message: "User does not exist" };
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      ctx.status = 400;
      ctx.body = { message: "Old password is incorrect" };
      return;
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);
    await User.update({ password: hashedPassword }, { where: { username } });
    ctx.status = 200;
    ctx.body = { message: "Password updated successfully" };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { message: "Internal server error", error: err.message };
  }
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
  }
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
  }
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
  }
};

//TO RESET PASSWORD
const resetPassword = async (ctx) =>{
  try{
    const { username , email } = ctx.request.body;
    const user = await User.findOne({where: {username: username}});
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
     const newResetedPass = otpGenerator.generate(6, {
        upperCaseAlphabets: true,
        specialChars: true,
        digits: true,
        lowerCaseAlphabets:true });

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "e2ac1ad1123eb9",
        pass: "3c2a4d058f9943"
      }
     });
    const info = await transporter.sendMail({
      from: '"Login App" <no-reply@loginapp.com>',
      to: email,
      subject:"Your New password , use it to Update your password" ,
      text: newResetedPass
    });
    const hashedPassword = await hashPassword(newResetedPass);
    console.log(hashedPassword);
    await User.update({password: hashedPassword}, {where: { username: username}});
    ctx.status = 200;
    ctx.body = {
      message:`Password reset successful, New password sent to user's E-mail,id: ${info.messageId}`
    };
  }
  catch(error){
    ctx.status = 500;
    ctx.body = {
      message: "Password changing operations failed",
      error: error
    }
  };
    
};

export {
  updatePassword,
  updateEmail,
  updateUsername,
  deleteUser,
  resetPassword
};
