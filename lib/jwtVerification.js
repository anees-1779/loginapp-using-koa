import jwt from "jsonwebtoken";
import { JWT_SECRECT } from "../config/database.js";

const tokenVerify = (ctx) =>{
  const token = ctx.headers.authorization?.split(' ')[1];
  const decoded =  jwt.verify(token, JWT_SECRECT);
  console.log(decoded)
  const username = decoded.username
  return username
}

const generateToken = (payload) =>{
  const token = jwt.sign(payload , JWT_SECRECT,{expiresIn:'1h'});
  return token;
}

export {tokenVerify, generateToken};