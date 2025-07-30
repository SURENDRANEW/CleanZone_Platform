const Report = require('../models/Report');
const fs = require('fs');
const logger = require('../utils/logger');

exports.createReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image' });
    }

    const report = new Report({
      user: req.user.id,
      location: req.body.location,
      landmark: req.body.landmark,
      description: req.body.description,
      photo: req.file.path.replace(/^.*[\\\/]uploads[\\\/]/, 'uploads/').replace(/\\/g, '/'),
      status: 'Pending',
    });

    await report.save();

    logger.info(`New report created by user ${req.user.id}`);
    return res.status(201).json(report);
  } catch (err) {
    // Clean up uploaded file if error occurs
    if (req.file) {
      fs.unlink(req.file.path, () => {
        // Log unlink error if needed - omitted here to avoid possible flooding
      });
    }
    logger.error('Report creation failed', { error: err.message });
    return res.status(500).json({ error: 'Failed to create report' });
  }
};

exports.getUserReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).sort('-createdAt');
    return res.json(reports);
  } catch (err) {
    logger.error('Failed to fetch user reports', { error: err.message });
    return res.status(500).json({ error: 'Due to Server error' });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('user', 'name email')
      .sort('-createdAt');
    return res.json(reports);
  } catch (err) {
    logger.error('Failed to fetch all reports', { error: err.message });
    return res.status(500).json({ error: 'Due to Server error' });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'In Progress', 'Resolved'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const report = await Report.findByIdAndUpdate(id, { status }, { new: true });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    logger.info(`Report ${id} status changed to ${status}`);
    return res.json(report);
  } catch (err) {
    logger.error('Failed to update report status', { error: err.message });
    return res.status(500).json({ error: 'Failed to update report' });
  }
};

