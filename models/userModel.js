import {sequelize} from '../config/database.js';
import { DataTypes } from 'sequelize';
//make a data model without using SQL Query
const User = sequelize.define('User',{
  id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey:true
  },
  username:{
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  email:{
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }

},{
  timestamps: true
});

export {User};