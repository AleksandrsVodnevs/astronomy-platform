const express = require('express');
const router = express.Router();
const News = require('../models/News');
const User = require('../models/User');
const { authenticate, isAdmin } = require('../middleware/auth');

// GET /api/news - get all news
router.get('/', async (req, res) => {
  try {
    const news = await News.findAll({
      include: [{ model: User, as: 'admin', attributes: ['firstName', 'lastName'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

// GET /api/news/:id - get single news
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id, {
      include: [{ model: User, as: 'admin', attributes: ['firstName', 'lastName'] }],
    });
    if (!news) return res.status(404).json({ message: 'Ziņa nav atrasta' });
    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

// POST /api/news - create news (admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { title, content, sourceUrl } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Virsraksts un saturs ir obligāti' });
    }

    const news = await News.create({
      title,
      content,
      sourceUrl,
      adminId: req.user.id,
    });

    res.status(201).json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

// PUT /api/news/:id - edit news (admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: 'Ziņa nav atrasta' });

    await news.update(req.body);
    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

// DELETE /api/news/:id - delete news (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: 'Ziņa nav atrasta' });

    await news.destroy();
    res.json({ message: 'Ziņa dzēsta' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

module.exports = router;