const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const connectToDatabase = require('../config/dbStudentUpload.js');

// Configure Multer for handling file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize GridFSBucket
let gridFSBucket;
async function initializeGridFSBucket() {
    const db = await connectToDatabase();
    gridFSBucket = new GridFSBucket(db);
}
initializeGridFSBucket();

// Controller function for file upload
const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        const { college, year, subjectcode } = req.body;

        if (!file || !college ) {
            return res.status(400).send('Fill all required details.');
        }

        if (!gridFSBucket) {
            return res.status(500).send('GridFSBucket is not initialized.');
        }

        const uploadStream = gridFSBucket.openUploadStream(file.originalname, {
            metadata: {
                college,
                year,
                subjectcode,
                verified: 0
            }
        });

        uploadStream.write(file.buffer);
        uploadStream.end();

        uploadStream.on('finish', () => {
            res.send({
                message: "File uploaded successfully",
                status: 1
            });
        });

    } catch (error) {
        console.error('Error uploading file to MongoDB:', error);
        res.status(500).send('Error uploading file to MongoDB.');
    }
};

module.exports = { uploadFile, upload };
