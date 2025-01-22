import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

const UserProfiles = sequelize.define('userProfiles',{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  citizenship: {
    type: DataTypes.STRING,
    unique: true,
    allowNull:false
  },
  permanentAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  },
  secondaryAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  },
  picture: {
    type: DataTypes.STRING,
  }
},{
  timestamps: true,
});

sequelize.sync({ force: false })  //force: false ensures it doesn't overwrite existing tables
  .then(() => console.log('userProfile table synced successfully'))
  .catch((err) => console.error('Error syncing user table:', err));

export { UserProfiles };