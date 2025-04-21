const express = require('express');
const router = express.Router();
const { 
  getCandidates,
  getCandidate,
  processResume,
  deleteCandidate,
  getAllCandidates
} = require('../controllers/candidateController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.route('/')
  .get(getAllCandidates);

router.route('/:jobId')
  .get(getCandidates);

router.route('/:id')
  .get(getCandidate)
  .delete(deleteCandidate);

router.post('/upload', upload.single('resume'), processResume);

module.exports = router;