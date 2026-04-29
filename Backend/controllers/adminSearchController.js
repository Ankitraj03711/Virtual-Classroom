const { MongoClient, GridFSBucket } = require('mongodb');
require('dotenv').config();

const dbName = 'pyqq';
const mongoURI = process.env.mongoURL;
const client = new MongoClient(mongoURI);

const connectToDatabase = require('../config/dbStudentUpload.js');

let gridFSBucket;

/**
 * Initialize GridFSBucket safely
 */
async function initializeGridFSBucket() {
  try {
    const db = await connectToDatabase();
    gridFSBucket = new GridFSBucket(db);
    console.log("✅ GridFSBucket initialized successfully");
  } catch (err) {
    console.error("❌ Error initializing GridFSBucket:", err);
  }
}

initializeGridFSBucket();

/**
 * Search file by filename in GridFS, return it as a PDF response,
 * and update its metadata.verified = 1
 */
const searchAndVerifyFile = async (req, res) => {
  try {
    const fileName = req.body.filename;

    if (!fileName || fileName.trim() === "") {
      return res.status(400).json({ error: "Filename is required." });
    }

    if (!gridFSBucket) {
      return res.status(500).json({ error: "GridFSBucket is not initialized yet." });
    }

    // Ensure MongoDB client connection is open
    if (!client.topology?.isConnected()) {
      await client.connect();
    }

    const db = client.db(dbName);
    const filesCollection = db.collection('fs.files');
    const chunksCollection = db.collection('fs.chunks');

    // Find file document by filename
    const fileDoc = await filesCollection.findOne({ filename: fileName });
    if (!fileDoc) {
      return res.status(404).json({ error: "No file found with that filename." });
    }

    // Fetch chunks for the file
    const chunks = await chunksCollection
      .find({ files_id: fileDoc._id })
      .sort({ n: 1 })
      .toArray();

    if (!chunks || chunks.length === 0) {
      return res.status(404).json({ error: "File data not found (no chunks)." });
    }

    // Combine all chunks into one PDF buffer
    const fileData = Buffer.concat(chunks.map(chunk => chunk.data.buffer));

    // Send PDF as response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileDoc.filename}"`);
    res.send(fileData);

    // Update metadata (set verified = 1)
    await filesCollection.updateOne(
      { _id: fileDoc._id },
      { $set: { "metadata.verified": 1 } }
    );

    console.log(`✅ Verified status updated for file: ${fileName}`);
  } catch (error) {
    console.error("❌ Error searching or sending file from MongoDB:", error);
    res.status(500).json({ error: "Error searching or sending file from MongoDB." });
  }
};

module.exports = { searchAndVerifyFile };
