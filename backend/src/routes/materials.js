const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
const User = require('../models/User');
const { authenticate, isAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const where = category ? { category } : {};
    const materials = await Material.findAll({
      where,
      include: [{ model: User, as: 'admin', attributes: ['firstName', 'lastName'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(materials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id, {
      include: [{ model: User, as: 'admin', attributes: ['firstName', 'lastName'] }],
    });
    if (!material) return res.status(404).json({ message: 'Materiāls nav atrasts' });
    res.json(material);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { title, content, category, difficulty, imageUrl } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Virsraksts, saturs un kategorija ir obligāti' });
    }
    const material = await Material.create({
      title,
      content,
      category,
      difficulty: difficulty || 'Iesācējs',
      imageUrl: imageUrl || null,
      adminId: req.user.id,
    });
    res.status(201).json(material);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (!material) return res.status(404).json({ message: 'Materiāls nav atrasts' });
    await material.update(req.body);
    res.json(material);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (!material) return res.status(404).json({ message: 'Materiāls nav atrasts' });
    await material.destroy();
    res.json({ message: 'Materiāls dzēsts' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

module.exports = router;
