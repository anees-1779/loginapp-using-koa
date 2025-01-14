import { User } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRECT } from '../config/database.js';
import bcrypt from 'bcryptjs';

// Check if the user exists by username
const checkUser = async (username) => {
  const user = await User.findOne({ where: { username } });
  return user;
};

// Check if the email already exists
const checkEmail = async (email) => {
  const existingEmail = await User.findOne({ where: { email } });
  return existingEmail;
};

// Hash the password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// Compare entered password with stored password
const checkPassword = async (enteredPassword, user) => {
  const isMatch = await bcrypt.compare(enteredPassword, user.password);
  return isMatch;
};

// Register user
const registerUser = async (ctx) => {
  let { username, password, email } = ctx.request.body;
  
  // Check if username or email already exists
  const user = await checkUser(username);
  const checkemail = await checkEmail(email);
  
  if (user || checkemail) {
    ctx.status = 400;
    ctx.body = { message: "Username or Email already exists" };
    return;
  }

  // Hash password and create the user
  password = await hashPassword(password);
  await User.create({ username, password, email });

  ctx.status = 201;
  ctx.body = { message: "User created successfully" };
  console.log('User created successfully');
};

// Login user
const login = async (ctx) => {
  const { username, password } = ctx.request.body;
  const user = await User.findOne({ where: { username } });

  if (user && user.username === username && await checkPassword(password, user)) {
    const payload = { username: user.username, email: user.email };
    const token = jwt.sign(payload, JWT_SECRECT, { expiresIn: '1h' });
    
    ctx.status = 200;
    ctx.body = {
      message: "Login successful",
      token: token
    };
    return;
  }

  ctx.body = { message: "Invalid Credentials" };
  ctx.status = 400;
};

// Export functions
export { login, registerUser };
