const multer = require('multer');
const { GridFSBucket } = require('mongodb');
require('dotenv').config();

const connectToDatabase = require('../config/dbVerified.js');

// Configure Multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GridFSBucket instance
let gridFSBucket;

// Initialize GridFSBucket
async function initializeGridFSBucket() {
  const db = await connectToDatabase();
  gridFSBucket = new GridFSBucket(db);
}
initializeGridFSBucket();


// const uploadFile = async (req, res) => {
//   try {
//     const file = req.file;
//     const { filename, year, examType } = req.body;

//     if (!file) {
//       return res.status(400).send("No file uploaded.");
//     }

//     if (!gridFSBucket) {
//       return res.status(500).send("GridFSBucket is not initialized.");
//     }

//     const uploadStream = gridFSBucket.openUploadStream(filename, {
//       metadata: { year, examType }
//     });

//     uploadStream.end(file.buffer);

//     uploadStream.on("finish", () => {
//       res.send("File uploaded successfully to MongoDB.");
//     });
//   } catch (error) {
//     console.error("Error uploading file to MongoDB:", error);
//     res.status(500).send("Error uploading file to MongoDB.");
//   }
// };

const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const { filename } = req.body;

    // Validate inputs
    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    if (!filename ) {
      return res.status(400).json({ error: "Filename, year, and examType are required." });
    }

    if (!gridFSBucket) {
      return res.status(500).json({ error: "GridFSBucket is not initialized." });
    }

    // Create upload stream with metadata
    const uploadStream = gridFSBucket.openUploadStream(filename.toUpperCase(), {
      metadata: {
        // year: parseInt(year, 10),
        // examType: parseInt(examType, 10),
        college: req.user?.college || "Unknown",
        // uploadedBy: req.user?.email || "Admin",
        uploadedAt: new Date(),
      },
    });

    // Write file buffer to GridFS
    uploadStream.end(file.buffer);

    uploadStream.on("finish", () => {
      return res.status(200).json({
        message: "File uploaded successfully ",
        fileId: uploadStream.id,
      });
    });

    uploadStream.on("error", (err) => {
      console.error("GridFS upload error:", err);
      return res.status(500).json({ error: "Error writing file to GridFS." });
    });
  } catch (error) {
    console.error("Error uploading file to MongoDB:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};



module.exports = { uploadFile, upload };
