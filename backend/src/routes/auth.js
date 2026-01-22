const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const EmailVerification = require('../models/EmailVerification');
const { sendPasswordResetEmail, sendVerificationCode } = require('../config/emailService');

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /api/auth/register — sends verification code, does NOT create user yet
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ message: 'Visi lauki ir obligāti' });
    if (password.length < 8)
      return res.status(400).json({ message: 'Parole ir pārāk īsa (min. 8 simboli)' });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Lietotājs ar šādu e-pastu jau eksistē' });

    const passwordHash = await bcrypt.hash(password, 10);
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    // Delete any old pending verifications for this email
    await EmailVerification.destroy({ where: { email, type: 'register', used: false } });

    await EmailVerification.create({
      userId: null,
      email,
      code,
      type: 'register',
      pendingData: JSON.stringify({ firstName, lastName, email, passwordHash }),
      expiresAt,
    });

    await sendVerificationCode(email, code, 'register');
    res.json({ message: 'Kods nosūtīts', email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

// POST /api/auth/verify-registration — confirm code and create user
router.post('/verify-registration', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: 'E-pasts un kods ir obligāti' });

    const verification = await EmailVerification.findOne({ where: { email, code, type: 'register', used: false } });
    if (!verification) return res.status(400).json({ message: 'Nepareizs vai novecojis kods' });
    if (new Date() > verification.expiresAt) return res.status(400).json({ message: 'Koda derīguma laiks ir beidzies' });

    const data = JSON.parse(verification.pendingData);

    // Check again that email not taken
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Lietotājs ar šādu e-pastu jau eksistē' });

    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash: data.passwordHash,
      role: 'user',
      status: 'active',
    });

    await verification.update({ used: true });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

// POST /api/auth/resend-code — resend verification code
router.post('/resend-code', async (req, res) => {
  try {
    const { email, type } = req.body;
    const verification = await EmailVerification.findOne({ where: { email, type, used: false } });
    if (!verification) return res.status(400).json({ message: 'Nav aktīva verifikācija' });

    // Rate limit: 1 minute between resends
    const createdAt = new Date(verification.updatedAt || verification.createdAt);
    const diff = Date.now() - createdAt.getTime();
    if (diff < 60000) {
      const wait = Math.ceil((60000 - diff) / 1000);
      return res.status(429).json({ message: `Uzgaidiet ${wait} sekundes`, wait });
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await verification.update({ code, expiresAt });
    await sendVerificationCode(email, code, type);
    res.json({ message: 'Kods atkārtoti nosūtīts' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'E-pasts un parole ir obligāti' });
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Nepareizs e-pasts vai parole' });
    if (user.status === 'blocked') return res.status(403).json({ message: 'Jūsu konts ir bloķēts' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: 'Nepareizs e-pasts vai parole' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'E-pasts ir obligāts' });
    const user = await User.findOne({ where: { email } });
    if (!user) return res.json({ message: 'Ja e-pasts eksistē, nosūtīsim atjaunošanas saiti.' });
    await PasswordReset.destroy({ where: { userId: user.id, used: false } });
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await PasswordReset.create({ userId: user.id, token, expiresAt });
    await sendPasswordResetEmail(user.email, token, user.firstName);
    res.json({ message: 'Ja e-pasts eksistē, nosūtīsim atjaunošanas saiti.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda. Mēģiniet vēlāk.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'Tokens un jaunā parole ir obligāti' });
    if (password.length < 8) return res.status(400).json({ message: 'Parole ir pārāk īsa (min. 8 simboli)' });
    const reset = await PasswordReset.findOne({ where: { token, used: false } });
    if (!reset) return res.status(400).json({ message: 'Nederīgs vai novecojis tokens' });
    if (new Date() > reset.expiresAt) return res.status(400).json({ message: 'Atjaunošanas saite ir beigusies' });
    const passwordHash = await bcrypt.hash(password, 10);
    await User.update({ passwordHash }, { where: { id: reset.userId } });
    await reset.update({ used: true });
    res.json({ message: 'Parole veiksmīgi atjaunota' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Servera kļūda' });
  }
});

module.exports = router;
