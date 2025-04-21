const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const filetypes = /pdf|docx|doc/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only allow single file upload
  }
});

module.exports = upload;