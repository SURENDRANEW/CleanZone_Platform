const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const logger = require('../utils/logger');

router.get('/public', async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();

    const reportsByStatus = await Report.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ totalReports, reportsByStatus });
  } catch (err) {
    logger.error('Error fetching public stats', { error: err.message });
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
