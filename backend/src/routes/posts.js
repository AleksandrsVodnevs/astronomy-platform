const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { authenticate } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { status: 'published' },
      include: [
        { model: User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'avatar'] },
        { model: Comment, attributes: ['id'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'avatar'] },
        {
          model: Comment,
          include: [{ model: User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'avatar'] }],
          order: [['createdAt', 'ASC']],
        },
      ],
    });
    if (!post) return res.status(404).json({ message: 'Ieraksts nav atrasts' });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, category, status, imageUrl } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Virsraksts, saturs un kategorija ir obligāti' });
    }
    const post = await Post.create({
      title,
      content,
      category,
      status: status || 'published',
      imageUrl: imageUrl || null,
      authorId: req.user.id,
    });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Ieraksts nav atrasts' });
    if (post.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Piekļuve liegta' });
    }
    await post.update(req.body);
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Ieraksts nav atrasts' });
    if (post.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Piekļuve liegta' });
    }
    await post.destroy();
    res.json({ message: 'Ieraksts dzēsts' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

module.exports = router;
