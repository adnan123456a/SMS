require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const path = require('path');

const User = require('./models/User');
const Room = require('./models/Room');
const Message = require('./models/Message');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/anime-messenger')
  .then(() => console.log('🌸 Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Session configuration
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'anime-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/anime-messenger'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure: false // Set to true if using HTTPS
  }
});

app.use(sessionMiddleware);

// Share session with Socket.IO
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

// Auth middleware
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login.html');
  }
  next();
};

// Routes
app.get('/', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/chat.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// API Routes

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({ error: 'Username must be 3-20 characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Create user
    const user = new User({ username, password });
    await user.save();

    // Set session
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.avatar = user.avatar;

    res.json({ success: true, user: { username: user.username, avatar: user.avatar } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set session
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.avatar = user.avatar;

    res.json({ success: true, user: { username: user.username, avatar: user.avatar } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Get current user
app.get('/api/user', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create room
app.post('/api/rooms', requireAuth, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.length < 3) {
      return res.status(400).json({ error: 'Room name must be at least 3 characters' });
    }

    const room = new Room({
      name,
      description,
      creator: req.session.userId,
      creatorName: req.session.username
    });

    await room.save();
    res.json(room);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all rooms
app.get('/api/rooms', requireAuth, async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get room messages
app.get('/api/rooms/:roomId/messages', requireAuth, async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId })
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Socket.IO
const activeUsers = new Map(); // socketId -> { userId, username, avatar, roomId }

io.on('connection', (socket) => {
  const session = socket.request.session;
  
  if (!session.userId) {
    socket.disconnect();
    return;
  }

  console.log(`🌸 User connected: ${session.username}`);

  // Join room
  socket.on('join room', async ({ roomId }) => {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        socket.emit('error', 'Room not found');
        return;
      }

      // Add user to room members if not already
      if (!room.members.includes(session.userId)) {
        room.members.push(session.userId);
        await room.save();
      }

      socket.join(roomId);
      activeUsers.set(socket.id, {
        userId: session.userId,
        username: session.username,
        avatar: session.avatar,
        roomId
      });

      // Get online users in this room
      const onlineUsers = Array.from(activeUsers.values())
        .filter(u => u.roomId === roomId)
        .map(u => ({ username: u.username, avatar: u.avatar }));

      // Notify room
      io.to(roomId).emit('user joined', {
        username: session.username,
        avatar: session.avatar,
        onlineCount: onlineUsers.length
      });

      socket.emit('room joined', {
        roomId,
        roomName: room.name,
        onlineUsers
      });

      console.log(`${session.username} joined room: ${room.name}`);
    } catch (error) {
      console.error('Join room error:', error);
      socket.emit('error', 'Failed to join room');
    }
  });

  // Send message
  socket.on('chat message', async ({ roomId, message }) => {
    try {
      const user = activeUsers.get(socket.id);
      if (!user || user.roomId !== roomId) {
        return;
      }

      // First, broadcast the message immediately for real-time display
      const messageData = {
        sender: session.userId,
        senderName: session.username,
        senderAvatar: session.avatar,
        message: message.trim(),
        createdAt: new Date(),
        _id: new mongoose.Types.ObjectId() // Temporary ID for client
      };

      io.to(roomId).emit('chat message', messageData);

      // Then save to database in the background
      const dbMessage = new Message({
        room: roomId,
        sender: session.userId,
        senderName: session.username,
        senderAvatar: session.avatar,
        message: message.trim()
      });

      await dbMessage.save();
      console.log(`💬 Message saved: ${session.username} in room ${roomId}`);
    } catch (error) {
      console.error('Send message error:', error);
    }
  });

  // Typing indicator
  socket.on('typing', () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      socket.to(user.roomId).emit('typing', {
        username: user.username
      });
    }
  });

  socket.on('stop typing', () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      socket.to(user.roomId).emit('stop typing');
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      socket.to(user.roomId).emit('user left', {
        username: user.username
      });
      
      // Update online count
      const onlineUsers = Array.from(activeUsers.values())
        .filter(u => u.roomId === user.roomId && u.userId !== user.userId);
      
      io.to(user.roomId).emit('update online count', onlineUsers.length);
      
      activeUsers.delete(socket.id);
      console.log(`👋 User disconnected: ${user.username}`);
    }
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`🌸 Anime Messenger running on http://localhost:${PORT}`);
});
