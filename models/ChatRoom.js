const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 2,
    maxlength: 50
  },
  description: {
    type: String,
    default: '',
    maxlength: 200
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  messageCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
