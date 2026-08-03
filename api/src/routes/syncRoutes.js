const express = require('express');
const router = express.Router();
const { syncData } = require('../controllers/syncController');
const { authenticateToken } = require('../middlewares/auth');

router.post('/', authenticateToken, syncData);

module.exports = router;
