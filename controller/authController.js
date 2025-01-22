import { User } from '../models/userModel.js';
import * as yup from 'yup';
import { generateToken } from '../lib/jwtVerification.js';
import { checkPassword, hashedPassword } from '../lib/hashPassword.js';
import { UserProfiles } from '../models/userProfiles.js';

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

// Check if the email already exists
const checkCTZNS = async (citizenship) => {
  const ctz =  await UserProfiles.findOne({ where: { citizenship } })
  return ctz;
};


// Register user
const registerUser = async (ctx) => {
  const { username, password, email,Users_name, permanentAddress, secondaryAddress, citizenship } = ctx.request.body;

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
    const checksss =  await checkCTZNS(citizenship);
    console.log(checksss)
    if(await checkCTZNS(citizenship)){
      ctx.status = 400;
      ctx.body = { message: "Citizenship is already used by another username" };
      return;
    }
    // Hash password and create the user
    const Password = await hashedPassword(password);
    const user = await User.create({ username, password: Password, email, Users_name ,
    UserProfiles:{
      permanentAddress, secondaryAddress, citizenship
    },},
    { include: [UserProfiles] });
    ctx.status = 201;
    ctx.body = { message: "User created successfully" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: "Internal server error", error: error.message };
  }
};

// Login user
const login = async (ctx) => {
  const { username, password, email } = ctx.request.body;
  console.log(username,password)
  console.log(typeof(password))
  // Validate request body
  const validation = await validInfo({ username, password ,email});
  if (!validation.valid) {
    ctx.status = 400;
    ctx.body = { errors: validation.errors };
    return;
  }
  try {
    const user = await checkUser(username);
    if (user && await checkPassword(password, user.password)) {
      const payload = { username: user.username, email: user.email };
      console.log(payload)
      const token = await generateToken(payload);
      console.log(token)

      ctx.status = 200;
      ctx.body = { message: "Login successful", token:token };
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
export { login, registerUser };
