const express = require('express');
const cors = require('cors');
const { getUnverifiedFiles } = require('../controllers/adminVerifyController.js');
const authenticateToken = require('../utils/auth.js');

const AdminVerifyRouter = express.Router();
// AdminVerifyRouter.use(cors());


AdminVerifyRouter.get('/',authenticateToken , getUnverifiedFiles);

module.exports = { AdminVerifyRouter };