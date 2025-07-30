require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const { initializeAdmin } = require('./controllers/authController');
const logger = require('./utils/logger');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

connectDB().then(async () => {
    await initializeAdmin();
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/reports', require('./routes/reportRoutes'));
    app.use('/api/stats', require('./routes/statsRoutes'));


    app.get('/api', (req, res) => res.json({ status: 'active', timestamp: new Date() }));
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  })
  .catch(err => {
    logger.error('Server startup failed', { error: err.message });
    process.exit(1);
  });
