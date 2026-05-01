const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Material = sequelize.define('Material', {
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
  category: {
    type: DataTypes.ENUM('Astronomija', 'Astrofotogrāfija'),
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.ENUM('Iesācējs', 'Vidējs', 'Pieredzējis'),
    defaultValue: 'Iesācējs',
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'materials',
  timestamps: true,
});

module.exports = Material;