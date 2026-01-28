const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get messages for a room (with pagination)
router.get('/:roomId', async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;
    
    const messages = await Message.find({ roomId: req.params.roomId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('senderId', 'username avatarUrl');

    const totalCount = await Message.countDocuments({ roomId: req.params.roomId });

    res.json({
      messages: messages.reverse(),
      totalCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
