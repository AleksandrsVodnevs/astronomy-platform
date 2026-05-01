const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, async (req, res) => {
  try {
    const { content, postId, imageUrl } = req.body;
    if (!content || !postId) {
      return res.status(400).json({ message: 'Saturs un ieraksta ID ir obligāti' });
    }
    if (content.length > 500) {
      return res.status(400).json({ message: 'Komentārs nevar pārsniegt 500 rakstzīmes' });
    }
    const comment = await Comment.create({
      content,
      postId,
      imageUrl: imageUrl || null,
      authorId: req.user.id,
    });
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Komentārs nav atrasts' });
    if (comment.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Piekļuve liegta' });
    }
    await comment.destroy();
    res.json({ message: 'Komentārs dzēsts' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

module.exports = router;
