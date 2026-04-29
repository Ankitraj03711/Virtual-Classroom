const { GridFSBucket, MongoClient } = require('mongodb');
require('dotenv').config();

const dbName = 'pyqq';
const connectToDatabase = require('../config/dbStudentUpload.js');

const mongoURI = process.env.mongoURL;
const client = new MongoClient(mongoURI);

let gridFSBucket;

// Initialize GridFSBucket
async function initializeGridFSBucket() {
    const db = await connectToDatabase();
    gridFSBucket = new GridFSBucket(db);
}
initializeGridFSBucket();

// Controller function to fetch unverified files
const getUnverifiedFiles = async (req, res) => {
    try {
        const db = client.db(dbName);
        console.log(req.user.college)
        const result = await db
            .collection('fs.files')
            .find({ "metadata.verified": 0,"metadata.college":req.user.college })
            .toArray();

        console.log(result);

        // Extract and process filenames (optional cleanup)
        // const array = result
        //     .map(file => file.filename ? file.filename.slice(0, -4) : null)
        //     .filter(filename => filename !== null);

        res.status(200).json({ unverifiedFiles: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getUnverifiedFiles };
