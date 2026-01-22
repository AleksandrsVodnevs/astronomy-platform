const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmailVerification = sequelize.define('EmailVerification', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: true }, // null = pending registration
  email: { type: DataTypes.STRING(100), allowNull: false },
  code: { type: DataTypes.STRING(6), allowNull: false },
  type: { type: DataTypes.ENUM('register', 'email_change'), allowNull: false },
  pendingData: { type: DataTypes.TEXT, allowNull: true }, // JSON for register data
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  used: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'email_verifications', timestamps: true });

module.exports = EmailVerification;
