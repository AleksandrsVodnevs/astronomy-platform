const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { authenticate } = require('../middleware/auth');

// GET /api/posts - get all published posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { status: 'published' },
      include: [{ model: User, as: 'author', attributes: ['firstName', 'lastName'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

// GET /api/posts/:id - get single post with comments
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User, as: 'author', attributes: ['firstName', 'lastName'] },
        {
          model: Comment,
          include: [{ model: User, as: 'author', attributes: ['firstName', 'lastName'] }],
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

// POST /api/posts - create post (authenticated)
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, category, status } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Virsraksts, saturs un kategorija ir obligāti' });
    }

    const post = await Post.create({
      title,
      content,
      category,
      status: status || 'published',
      authorId: req.user.id,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

// PUT /api/posts/:id - edit post (author or admin)
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

// DELETE /api/posts/:id - delete post (author or admin)
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