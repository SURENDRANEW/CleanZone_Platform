const multer = require('multer');
const logger = require('../utils/logger');

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(file.originalname.toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images (JPEG/JPG/PNG) are allowed'));
  }
};

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } 
});

module.exports = upload;

