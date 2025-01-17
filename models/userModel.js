import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

// Define the User model
const User = sequelize.define('users', {  // Model name 'User'
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'users',  // Explicit table name
  timestamps: true,
});

// Sync the model with the database
sequelize.sync({ force: false })  // `force: false` ensures it doesn't overwrite existing tables
  .then(() => console.log('User table synced successfully'))
  .catch((err) => console.error('Error syncing user table:', err));

export { User };
