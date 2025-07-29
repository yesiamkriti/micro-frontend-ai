const express = require('express');
const router = express.Router();
const { generateCode } = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/generate', authMiddleware, generateCode);

module.exports = router;
