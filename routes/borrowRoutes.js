const express = require('express');
const { borrowBook, returnBook, borrowHistory } = require('../controllers/borrowController');
const { authMiddleware, memberMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/borrow', authMiddleware, memberMiddleware, borrowBook);
router.post('/return', authMiddleware, memberMiddleware, returnBook);
router.get('/history/:userId', authMiddleware, memberMiddleware, borrowHistory);

module.exports = router;
