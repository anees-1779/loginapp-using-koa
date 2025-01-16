import { User } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRECT } from '../config/database.js';
import bcrypt from 'bcryptjs';
import * as yup from 'yup';

// Define validation schema
const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
});

// Validate input data
const validInfo = async (data) => {
  try {
    await schema.validate(data, { abortEarly: false });
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: error.errors,
    };
  }
};

// Check if the user exists by username
const checkUser = async (username) => await User.findOne({ where: { username } });

// Check if the email already exists
const checkEmail = async (email) => await User.findOne({ where: { email } });

// Hash the password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare entered password with stored password
const checkPassword = async (enteredPassword, user) => {
  return await bcrypt.compare(enteredPassword, user.password);
};

// Register user
const registerUser = async (ctx) => {
  const { username, password, email } = ctx.request.body;

  // Validate request body
  const validation = await validInfo({ username, password, email });
  if (!validation.valid) {
    ctx.status = 400;
    ctx.body = { errors: validation.errors };
    return;
  }

  try {
    // Check if username or email already exists
    if (await checkUser(username) || await checkEmail(email)) {
      ctx.status = 400;
      ctx.body = { message: "Username or Email already exists" };
      return;
    }

    // Hash password and create the user
    const hashedPassword = await hashPassword(password);
    await User.create({ username, password: hashedPassword, email });

    ctx.status = 201;
    ctx.body = { message: "User created successfully" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: "Internal server error", error: error.message };
  }
};

// Login user
const login = async (ctx) => {
  const { username, password } = ctx.request.body;

  // Validate request body
  const validation = await validInfo({ username, password });
  if (!validation.valid) {
    ctx.status = 400;
    ctx.body = { errors: validation.errors };
    return;
  }

  try {
    const user = await checkUser(username);
    if (user && await checkPassword(password, user)) {
      const payload = { username: user.username, email: user.email };
      const token = jwt.sign(payload, JWT_SECRECT, { expiresIn: '1h' });

      ctx.status = 200;
      ctx.body = { message: "Login successful", token };
      return;
    }

    ctx.status = 400;
    ctx.body = { message: "Invalid credentials" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: "Internal server error", error: error.message };
  }
};

// Export functions
export { login, registerUser, hashPassword };
