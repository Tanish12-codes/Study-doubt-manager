const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from root .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const User = require('../models/user');
const Doubt = require('../models/Doubt');
const Resource = require('../models/Resource');

async function checkData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get database name
    console.log(`Database Name: ${mongoose.connection.db.databaseName}`);

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    // Check users collection
    const users = await User.find({});
    console.log(`Users collection has ${users.length} documents`);
    if (users.length > 0) {
      console.log('Sample user:', { username: users[0].username });
    }

    // Check if Doubt model exists
    if (mongoose.models.Doubt) {
      const doubts = await Doubt.find({});
      console.log(`Doubts collection has ${doubts.length} documents`);
      if (doubts.length > 0) {
        console.log('Sample doubt:', {
          question: doubts[0].question,
          subject: doubts[0].subject,
          status: doubts[0].status
        });
      }
    } else {
      console.log('Doubt model not defined');
    }

    // Check if Resource model exists
    if (mongoose.models.Resource) {
      const resources = await Resource.find({});
      console.log(`Resources collection has ${resources.length} documents`);
      if (resources.length > 0) {
        console.log('Sample resource:', {
          title: resources[0].title,
          link: resources[0].link
        });
      }
    } else {
      console.log('Resource model not defined');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed');
  }
}

checkData();
