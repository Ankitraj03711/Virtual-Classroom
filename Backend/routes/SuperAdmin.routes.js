const express = require('express');
const { toggleSubscription, allSubsciptions } = require('../controllers/superAdminController.js');
const authenticateToken = require('../utils/auth.js');

const superadminRouter = express.Router();

superadminRouter.put('/toggle', authenticateToken, toggleSubscription);
superadminRouter.get('/all', authenticateToken, allSubsciptions);

module.exports = { superadminRouter };
