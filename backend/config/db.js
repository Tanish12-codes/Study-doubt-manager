const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    // Connect without deprecated options
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Log connection details
    console.log("MongoDB Connected!");
    console.log(`Database Name: ${conn.connection.db.databaseName}`);

    // List all collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    return conn;
  } catch (err) {
    console.error("MongoDB Connection Failed:", err.message);
    console.error(err.stack);  // Log the stack trace for more detail
    process.exit(1);
  }
};

module.exports = connectDB;
