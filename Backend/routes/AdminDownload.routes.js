const express = require('express');
const cors = require('cors');
const { searchAndVerifyFile } = require('../controllers/adminSearchController.js');
const authenticateToken = require('../utils/auth.js');

const AdminSearchRouter = express.Router();
AdminSearchRouter.use(cors());


AdminSearchRouter.post('/search-files',authenticateToken , searchAndVerifyFile);

module.exports = { AdminSearchRouter };
