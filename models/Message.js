const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderAvatar: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
messageSchema.index({ roomId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
