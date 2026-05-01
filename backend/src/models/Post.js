const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('Planētas', 'Galaktikas', 'Kosmoss', 'Astrofizika', 'Novērojumi'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'published',
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'posts',
  timestamps: true,
});

module.exports = Post;