const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const EmailVerification = require('../models/EmailVerification');
const { authenticate, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { sendVerificationCode } = require('../config/emailService');

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();
const PUBLIC_ATTRS = ['id', 'firstName', 'lastName', 'avatar', 'bio', 'location', 'website', 'interests', 'role', 'createdAt'];
const PRIVATE_ATTRS = [...PUBLIC_ATTRS, 'email', 'status'];

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: PRIVATE_ATTRS });
    if (!user) return res.status(404).json({ message: 'Lietotājs nav atrasts' });
    res.json(user);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Servera kļūda' }); }
});

router.put('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'Lietotājs nav atrasts' });
    const { firstName, lastName, bio, location, website, interests } = req.body;
    await user.update({ firstName, lastName, bio, location, website, interests });
    res.json({ id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, avatar: user.avatar, bio: user.bio, location: user.location, website: user.website, interests: user.interests });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Servera kļūda' }); }
});

router.post('/me/email/request', authenticate, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'E-pasts un parole ir obligāti' });
    const user = await User.findByPk(req.user.id);
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: 'Nepareiza parole' });
    if (email === user.email) return res.status(400).json({ message: 'Jaunajam e-pastam jāatšķiras no pašreizējā' });
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Šis e-pasts jau tiek izmantots' });
    await EmailVerification.destroy({ where: { userId: user.id, type: 'email_change', used: false } });
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await EmailVerification.create({ userId: user.id, email, code, type: 'email_change', expiresAt });
    await sendVerificationCode(email, code, 'email_change');
    res.json({ message: 'Kods nosūtīts uz jauno e-pastu' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Servera kļūda' }); }
});

router.post('/me/email/confirm', authenticate, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Kods ir obligāts' });
    const verification = await EmailVerification.findOne({ where: { userId: req.user.id, code, type: 'email_change', used: false } });
    if (!verification) return res.status(400).json({ message: 'Nepareizs vai novecojis kods' });
    if (new Date() > verification.expiresAt) return res.status(400).json({ message: 'Koda derīguma laiks ir beidzies' });
    await User.update({ email: verification.email }, { where: { id: req.user.id } });
    await verification.update({ used: true });
    res.json({ message: 'E-pasts veiksmīgi mainīts', email: verification.email });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Servera kļūda' }); }
});

router.put('/me/password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Visi lauki ir obligāti' });
    if (newPassword.length < 8) return res.status(400).json({ message: 'Jaunā parole ir pārāk īsa (min. 8 simboli)' });
    const user = await User.findByPk(req.user.id);
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return res.status(400).json({ message: 'Pašreizējā parole ir nepareiza' });
    const sameAsNew = await bcrypt.compare(newPassword, user.passwordHash);
    if (sameAsNew) return res.status(400).json({ message: 'Jaunajai parolei jāatšķiras no pašreizējās' });
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await user.update({ passwordHash });
    res.json({ message: 'Parole veiksmīgi mainīta' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Servera kļūda' }); }
});

router.delete('/me', authenticate, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Parole ir obligāta' });
    const user = await User.findByPk(req.user.id);
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: 'Nepareiza parole' });
    await user.destroy();
    res.json({ message: 'Konts dzēsts' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Servera kļūda' }); }
});

router.post('/me/avatar', authenticate, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Nav pievienots attēls' });
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'avatars', public_id: `avatar_${req.user.id}`, overwrite: true, resource_type: 'image' },
        (error, result) => error ? reject(error) : resolve(result)
      );
      stream.end(req.file.buffer);
    });
    const user = await User.findByPk(req.user.id);
    await user.update({ avatar: result.secure_url });
    res.json({ avatar: result.secure_url });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Servera kļūda' }); }
});

router.get('/:id/comments/count', async (req, res) => {
  try {
    const count = await Comment.count({ where: { authorId: req.params.id } });
    res.json({ count });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Servera kļūda' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: PUBLIC_ATTRS });
    if (!user) return res.status(404).json({ message: 'Lietotājs nav atrasts' });
    const posts = await Post.findAll({ where: { authorId: req.params.id, status: 'published' }, order: [['createdAt', 'DESC']], limit: 20 });
    res.json({ user, posts });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Servera kļūda' }); }
});

router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'status', 'createdAt', 'avatar'], order: [['createdAt', 'DESC']] });
    res.json(users);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Servera kļūda' }); }
});

router.put('/:id/role', authenticate, isAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Lietotājs nav atrasts' });
    await user.update({ role: req.body.role });
    res.json({ message: 'Loma mainīta', role: user.role });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Servera kļūda' }); }
});

router.put('/:id/status', authenticate, isAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Lietotājs nav atrasts' });
    await user.update({ status: req.body.status });
    res.json({ message: 'Statuss mainīts', status: user.status });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Servera kļūda' }); }
});

module.exports = router;