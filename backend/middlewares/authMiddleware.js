const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

exports.authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    logger.warn('Authentication attempt without token', { path: req.path, ip: req.ip });
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) throw new Error('User not found');
    req.user = user;
    next();
  } catch (err) {
    logger.error('Authentication failed', { error: err.message, token: token.substring(0, 10) + '...' });
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    logger.warn('Unauthorized admin access attempt', { user: req.user.id, path: req.path });
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
