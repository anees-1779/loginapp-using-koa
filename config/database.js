import Sequelize from 'sequelize';  // to interact with the database using objects
import dotenv from 'dotenv';  // ES module import for dotenv

dotenv.config();  // Load environment variables from .env file

const JWT_SECRECT = process.env.JWT_SECRECT; 
console.log(JWT_SECRECT)
// Correcting the typo in 'JWT_SECRET'
const sequelize = new Sequelize(
  process.env.DB_name,
  process.env.DB_username,
  process.env.DB_password,
  {
    host: process.env.DB_host,
    port: process.env.DB_port,
    dialect: 'postgres',
    logging: false,
  }
);

export { sequelize, JWT_SECRECT };  // ES module export
