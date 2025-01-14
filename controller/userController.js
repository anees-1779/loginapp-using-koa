import { JWT_SECRECT } from '../config/database.js';
import {User} from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt  from 'jsonwebtoken';
// Update the password
const updatePassword = async (ctx) => {
  try {
    const token = ctx.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRECT);
    const username = decoded.username;
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
export {
  updatePassword,
  updateEmail,
  updateUsername,
  deleteUser,
};
