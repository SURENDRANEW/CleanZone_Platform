const express = require('express');
const router = express.Router();

const { authenticate, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerConfig');
const reportController = require('../controllers/reportController');

router.post('/', authenticate, upload.single('photo'), reportController.createReport);
router.get('/user', authenticate, reportController.getUserReports);
router.get('/all', authenticate, isAdmin, reportController.getAllReports);
router.put('/:id/status', authenticate, isAdmin, reportController.updateReportStatus);

module.exports = router;

