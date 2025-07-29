const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessionsByUser,
  getSessionById,
  updateSession,
} = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', createSession);
router.get('/', getSessionsByUser);
router.get('/:id', getSessionById);
router.put('/:id', updateSession);

module.exports = router;
