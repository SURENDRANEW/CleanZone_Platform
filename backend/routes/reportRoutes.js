const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerConfig');
const {
  createReport,
  getUserReports,
  getAllReports,
  updateReportStatus
} = require('../controllers/reportController');


router.post('/', authenticate, upload.single('photo'), createReport);



router.get('/user', authenticate, getUserReports);

router.get('/all', authenticate, isAdmin, getAllReports);
router.put('/:id/status', authenticate, isAdmin, updateReportStatus);

module.exports = router;

