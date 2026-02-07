const express = require("express");
const http = require('http');
const path = require("path");
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const { default: MongoStore } = require('connect-mongo');
require('dotenv').config();

// Models
const User = require('./models/User');
const ChatRoom = require('./models/ChatRoom');
const Message = require('./models/Message');

// Routes
const chatRoomsRouter = require('./routes/chatRooms');
const messagesRouter = require('./routes/messages');
const authRouter = require('./routes/auth');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// MongoDB Connection (for sessions)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/chat-app';

mongoose.connect(MONGO_URI).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  store: new MongoStore({
    mongoUrl: MONGO_URI,
    touchAfter: 24 * 3600
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// REST APIs
app.use('/api/auth', authRouter);
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

      // Find or create user
      let user = await User.findOne({ username: senderName });
      if (!user) {
        user = new User({
          username: senderName,
          email: `${senderName}@chat.local`,
          avatarUrl: senderAvatar,
          profilePicture: senderAvatar
        });
        await user.save();
      } else {
        // Update avatar if changed
        user.avatarUrl = senderAvatar;
        user.profilePicture = senderAvatar;
        await user.save();
      }

      // Save to MongoDB
      const newMessage = new Message({
        roomId,
        senderId: user._id,
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
        senderId: user._id,
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

// Handle chat room routing
app.get("/chat/:roomName", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
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