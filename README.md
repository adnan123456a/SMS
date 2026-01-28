# Real-Time Chat Application (SMS)

A full-featured real-time chat system built with **Node.js + Express + Socket.IO + MongoDB**.

## 🎯 Features

✅ **Real-time Messaging** – Socket.IO powered live chat  
✅ **Chat Rooms** – Create and manage multiple chat rooms  
✅ **Message History** – Persistent message storage in MongoDB  
✅ **User Avatars** – Auto-generated avatars for each user  
✅ **Responsive UI** – Works perfectly on desktop and mobile  
✅ **Dark Mode** – Modern glassmorphism design  
✅ **Auto-scroll** – Auto-scrolls to latest messages  
✅ **Message Timestamps** – Shows when each message was sent  

## 📁 Project Structure

```
SMS/
├── models/
│   ├── User.js          # User schema
│   ├── ChatRoom.js      # Chat room schema
│   └── Message.js       # Message schema
├── routes/
│   ├── chatRooms.js     # Room APIs (POST, GET)
│   └── messages.js      # Message history API
├── public/
│   ├── index.html       # Main HTML
│   ├── js/
│   │   ├── app.js       # Main app logic
│   │   └── int.js       # (Old file, can be removed)
│   └── style/
│       ├── container.css # Main styles
│       └── main.css     # Additional styles
├── server.js            # Express + Socket.IO server
├── .env                 # Environment variables
└── package.json         # Dependencies
```

## 🚀 Setup & Installation

### 1. **Prerequisites**
- Node.js (v14+)
- MongoDB (local or Atlas)

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Configure MongoDB**
Edit `.env`:
```env
MONGO_URI=mongodb://localhost:27017/chat-app
PORT=3000
NODE_ENV=development
```

For MongoDB Atlas, use:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app
```

### 4. **Start the Server**
```bash
npm start
```

Or with auto-reload (nodemon):
```bash
npx nodemon server.js
```

The app will be available at: **http://localhost:3000**

## 📡 API Endpoints

### Chat Rooms
```
POST   /api/chatrooms           # Create a new room
GET    /api/chatrooms           # Get all rooms
GET    /api/chatrooms/:name     # Get room details
```

**Create Room Example:**
```bash
curl -X POST http://localhost:3000/api/chatrooms \
  -H "Content-Type: application/json" \
  -d '{"name":"general","description":"General chat","createdBy":"user123"}'
```

### Messages
```
GET    /api/messages/:roomId    # Get message history (with pagination)
```

**Query Parameters:**
- `limit=50` – Number of messages to fetch (default: 50)
- `skip=0` – Number of messages to skip (for pagination)

## 🔌 Socket.IO Events

### Client → Server
```javascript
// User joins with their info
socket.emit('userJoin', { username, avatar });

// Join a chat room
socket.emit('joinRoom', 'room-name');

// Send a message
socket.emit('sendMessage', {
  roomId,
  roomName,
  senderId,
  senderName,
  senderAvatar,
  message
});

// Leave room
socket.emit('leaveRoom', 'room-name');
```

### Server → Client
```javascript
// Receive new message
socket.on('receiveMessage', (data) => {
  // { _id, senderId, senderName, senderAvatar, message, createdAt }
});

// User joined notification
socket.on('userJoined', (data) => {
  // { username }
});

// User left notification
socket.on('userLeft', (data) => {
  // { username }
});

// User status updates
socket.on('userStatusUpdate', (data) => {
  // { type: 'joined'|'left', user: {...} }
});
```

## 💾 Database Schemas

### User
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  avatarUrl: String,
  createdAt: Date
}
```

### ChatRoom
```javascript
{
  _id: ObjectId,
  name: String (unique, lowercase),
  description: String,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  messageCount: Number
}
```

### Message
```javascript
{
  _id: ObjectId,
  roomId: ObjectId (ref: ChatRoom),
  senderId: ObjectId (ref: User),
  senderName: String,
  senderAvatar: String,
  message: String (max 1000 chars),
  createdAt: Date
}
```

## 🎨 UI/UX Highlights

- **Dark Mode with Glassmorphism** – Modern frosted glass effect
- **Gradient Accents** – Purple/blue gradient buttons
- **Responsive Layout** – Sidebar on desktop, collapsible on mobile
- **Message Bubbles** – Different styling for own vs. others' messages
- **Avatar Circles** – Auto-generated based on username
- **Smooth Animations** – Fade-in and slide-in effects
- **Auto-scroll** – Always shows latest messages

## 🔐 Security Considerations

- ✅ Message length validation (max 1000 chars)
- ✅ XSS protection (HTML escaping)
- ✅ Room name validation (no duplicates)
- ✅ Input sanitization
- ⚠️ **TODO:** Add JWT authentication for user sessions
- ⚠️ **TODO:** Add rate limiting for messages

## 🚀 Future Enhancements

1. **User Authentication** – JWT-based login/signup
2. **Typing Indicators** – "User is typing..." feature
3. **Read Receipts** – Show who's read messages
4. **Private Rooms** – Password-protected rooms
5. **Online Users List** – See active participants
6. **Message Reactions** – Emoji reactions to messages
7. **File Sharing** – Upload images/files
8. **Message Search** – Search through chat history
9. **User Profiles** – Custom avatars, bios, etc.
10. **Admin Controls** – Ban users, delete messages, etc.

## 🧪 Testing

### Test Creating a Room
```bash
curl -X GET http://localhost:3000/api/chatrooms
```

### Test Loading Messages
```bash
# Replace ROOM_ID with actual room ID from previous response
curl -X GET http://localhost:3000/api/messages/ROOM_ID
```

## 📝 Environment Variables

```env
MONGO_URI        # MongoDB connection string
PORT             # Server port (default: 3000)
NODE_ENV         # development | production
```

## 🤝 Contributing

Feel free to fork, modify, and enhance this project!

## 📄 License

MIT License – See `LICENSE` file for details.

---

**Built with ❤️ using Node.js + Socket.IO + MongoDB**

For questions or issues, open a GitHub issue or contact the maintainer.
