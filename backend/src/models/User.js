const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('guest', 'user', 'admin'),
    defaultValue: 'user',
  },
  status: {
    type: DataTypes.ENUM('active', 'blocked'),
    defaultValue: 'active',
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  bio: {
    type: DataTypes.STRING(300),
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  interests: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;