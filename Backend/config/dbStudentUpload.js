const { MongoClient, ObjectId } = require('mongodb');

require('dotenv').config();

const mongoURI = process.env.mongoURL;
const dbName = "pyqq";

const client = new MongoClient(mongoURI);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB for student"); 
        return client.db(dbName);
    } catch (error) {
        console.error("Error connecting to MongoDB2:", error); 
        process.exit(1);
    }
}

module.exports = connectToDatabase;