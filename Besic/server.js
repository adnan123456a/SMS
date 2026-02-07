const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Serve static files
app.use(express.static('public'));

// Store active users
const users = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle user join
  socket.on('user joined', (username) => {
    users.set(socket.id, {
      username: username,
      avatar: Math.floor(Math.random() * 8) + 1 // Random anime avatar
    });
    
    // Notify all users
    io.emit('user joined', {
      username: username,
      userCount: users.size
    });
    
    // Send current user list to the new user
    socket.emit('user list', Array.from(users.values()));
  });

  // Handle chat messages
  socket.on('chat message', (msg) => {
    const user = users.get(socket.id);
    if (user) {
      io.emit('chat message', {
        username: user.username,
        avatar: user.avatar,
        message: msg,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  });

  // Handle typing indicator
  socket.on('typing', () => {
    const user = users.get(socket.id);
    if (user) {
      socket.broadcast.emit('typing', user.username);
    }
  });

  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing');
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      users.delete(socket.id);
      io.emit('user left', {
        username: user.username,
        userCount: users.size
      });
    }
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`🌸 Anime Chat Server running on http://localhost:${PORT}`);
});
