const express = require('express');
const router = express.Router();
const ChatRoom = require('../models/ChatRoom');
const User = require('../models/User');

// Create a new chat room
router.post('/', async (req, res) => {
  try {
    const { name, description, createdBy } = req.body;

    if (!name || !createdBy) {
      return res.status(400).json({ error: 'Name and createdBy are required' });
    }

    // Check if room exists
    const existingRoom = await ChatRoom.findOne({ name: name.toLowerCase().trim() });
    if (existingRoom) {
      return res.status(409).json({ error: 'Room name already exists' });
    }

    const newRoom = new ChatRoom({
      name: name.toLowerCase().trim(),
      description,
      createdBy
    });

    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all chat rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await ChatRoom.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username avatarUrl');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific room by name
router.get('/:name', async (req, res) => {
  try {
    const room = await ChatRoom.findOne({ name: req.params.name.toLowerCase().trim() })
      .populate('createdBy', 'username avatarUrl');
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
