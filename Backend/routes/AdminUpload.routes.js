const express = require('express');
const { uploadFile, upload } = require('../controllers/adminUploadController.js');
const authenticateToken = require('../utils/auth.js');

const AdminUploadRouter = express.Router();


AdminUploadRouter.post('/upload-files',authenticateToken , upload.single('file'), uploadFile);

module.exports = { AdminUploadRouter };
