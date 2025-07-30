const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { login, register } = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6+ characters').isLength({ min: 6 }),
    check('phone', 'Valid phone number required').matches(/^[0-9]{10}$/),
    check('location', 'Location is required').not().isEmpty()
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    check('role', 'Role must be user or admin').isIn(['user', 'admin'])
  ],
  login
);

router.get('/verify', authenticate, (req, res) => {
  res.json({ user: req.user, valid: true });
});

module.exports = router;
