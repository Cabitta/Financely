const express = require('express');
const router = express.Router();
const { createHousehold, joinHousehold, getHouseholdSummary } = require('../controllers/householdController');
const { authenticateToken } = require('../middlewares/auth');

router.post('/', authenticateToken, createHousehold);
router.post('/join', authenticateToken, joinHousehold);
router.get('/:id/summary', authenticateToken, getHouseholdSummary);

module.exports = router;
