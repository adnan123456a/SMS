const express = require("express");
const http = require('http');
const path = require("path");
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Models
const User = require('./models/User');
const ChatRoom = require('./models/ChatRoom');
const Message = require('./models/Message');

// Routes
const chatRoomsRouter = require('./routes/chatRooms');
const messagesRouter = require('./routes/messages');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/chat-app';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// REST APIs
app.use('/api/chatrooms', chatRoomsRouter);
app.use('/api/messages', messagesRouter);

// Socket.IO Logic
const activeUsers = {}; // Track active users: { socketId: { userId, username, avatar } }

io.on('connection', (socket) => {
  console.log('📱 User connected:', socket.id);

  // User joins with their info
  socket.on('userJoin', (userData) => {
    activeUsers[socket.id] = userData;
    socket.broadcast.emit('userStatusUpdate', {
      type: 'joined',
      user: userData
    });
  });

  // Join a chat room
  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
    console.log(`👤 ${socket.id} joined room: ${roomName}`);
    
    // Notify room members
    io.to(roomName).emit('userJoined', {
      username: activeUsers[socket.id]?.username || 'Unknown'
    });
  });

  // Leave a chat room
  socket.on('leaveRoom', (roomName) => {
    socket.leave(roomName);
    if (activeUsers[socket.id]) {
      io.to(roomName).emit('userLeft', {
        username: activeUsers[socket.id].username
      });
    }
  });

  // Send message
  socket.on('sendMessage', async (data) => {
    try {
      const { roomId, roomName, senderId, senderName, senderAvatar, message } = data;

      // Validate
      if (!message.trim() || message.length > 1000) {
        socket.emit('error', 'Invalid message');
        return;
      }

      // Save to MongoDB
      const newMessage = new Message({
        roomId,
        senderId,
        senderName,
        senderAvatar,
        message: message.trim()
      });

      await newMessage.save();

      // Update message count
      await ChatRoom.findByIdAndUpdate(roomId, { 
        $inc: { messageCount: 1 } 
      });

      // Broadcast to room
      io.to(roomName).emit('receiveMessage', {
        _id: newMessage._id,
        senderId,
        senderName,
        senderAvatar,
        message: newMessage.message,
        createdAt: newMessage.createdAt
      });

    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('error', 'Failed to save message');
    }
  });

  // User disconnects
  socket.on('disconnect', () => {
    console.log('🚪 User disconnected:', socket.id);
    const userData = activeUsers[socket.id];
    delete activeUsers[socket.id];
    
    if (userData) {
      socket.broadcast.emit('userStatusUpdate', {
        type: 'left',
        user: userData
      });
    }
  });

  // Error handling
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Serve HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chat.html"));
});

// Fallback for SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});