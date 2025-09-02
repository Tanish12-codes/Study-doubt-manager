const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
  question: { 
    type: String, 
    required: true 
  },
  subject: { 
    type: String 
  },
  status: { 
    type: String, 
    default: 'unresolved',
    enum: ['unresolved', 'resolved'] // Optional: restrict to these values
  },
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

module.exports = mongoose.model('Doubt', doubtSchema);