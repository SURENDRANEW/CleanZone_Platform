const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

const initializeAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminExists = await User.findOne({ email: adminEmail });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    try {
      await User.create({
        name: process.env.ADMIN_NAME,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        location: process.env.ADMIN_LOCATION,
        phone: process.env.ADMIN_PHONE,
      });
      logger.info('Admin account created');
    } catch (err) {
      logger.error('Admin creation failed', { error: err.message });
    }
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, phone, location } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const newUser = new User({
      name,
      email,
      phone,
      password,
      location,
      role: email === process.env.ADMIN_EMAIL ? 'admin' : 'user',
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    logger.error('Registration failed', { error: err.message, email: req.body.email });
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    let passwordMatched = false;
    if (user.role === 'admin') {
      if (password === process.env.ADMIN_PASSWORD) {
        passwordMatched = true;
      } else {
        passwordMatched = await user.comparePassword(password);
      }
    } else {
      passwordMatched = await user.comparePassword(password);
    }

    if (!passwordMatched) return res.status(400).json({ error: 'Invalid credentials' });

    if ((user.role || '').trim().toLowerCase() !== (role || '').trim().toLowerCase()) {
      return res.status(400).json({ error: 'Invalid account type' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      role: user.role,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    logger.error('Login failed', { error: err.message });
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { initializeAdmin, register, login };




