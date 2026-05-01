const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const News = sequelize.define('News', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  sourceUrl: {
    type: DataTypes.STRING(300),
    allowNull: true,
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'news',
  timestamps: true,
});

module.exports = News;