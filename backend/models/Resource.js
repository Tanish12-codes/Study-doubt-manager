const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: String,
  link: String,
  subject: String,
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Resource', resourceSchema);