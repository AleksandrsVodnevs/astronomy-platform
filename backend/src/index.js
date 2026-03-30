const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/database');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const News = require('./models/News');
const Material = require('./models/Material');
const PasswordReset = require('./models/PasswordReset');
const EmailVerification = require('./models/EmailVerification');

User.hasMany(Post, { foreignKey: 'authorId' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
User.hasMany(Comment, { foreignKey: 'authorId' });
Comment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
Post.hasMany(Comment, { foreignKey: 'postId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });
User.hasMany(News, { foreignKey: 'adminId' });
News.belongsTo(User, { foreignKey: 'adminId', as: 'admin' });
User.hasMany(Material, { foreignKey: 'adminId' });
Material.belongsTo(User, { foreignKey: 'adminId', as: 'admin' });
User.hasMany(PasswordReset, { foreignKey: 'userId' });
PasswordReset.belongsTo(User, { foreignKey: 'userId' });

const authRoutes     = require('./routes/auth');
const postRoutes     = require('./routes/posts');
const commentRoutes  = require('./routes/comments');
const newsRoutes     = require('./routes/news');
const userRoutes     = require('./routes/users');
const materialRoutes = require('./routes/materials');
const apodRoutes     = require('./routes/apod');

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/apod',     apodRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database connected and synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Database connection error:', err));
