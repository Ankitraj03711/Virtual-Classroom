const express = require('express');
const cors = require('cors');
const { searchFiles } = require('../controllers/searchController.js');

const SearchRouter = express.Router();
SearchRouter.use(cors());


SearchRouter.post('/search-files', searchFiles);

module.exports = { SearchRouter };
