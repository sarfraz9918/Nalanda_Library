const express = require('express');
const { getAllUsers } = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;
