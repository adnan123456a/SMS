# 🚀 Complete Setup Instructions

## Prerequisites
- Node.js 14+ installed
- MongoDB Atlas account or local MongoDB running
- npm installed

## Step 1: Install Dependencies
```bash
cd /workspaces/SMS
npm install
```

## Step 2: Configure Environment
Create/Update `.env` file with:
```env
MONGO_URI=mongodb://localhost:27017/chat-app
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app?retryWrites=true&w=majority

SESSION_SECRET=your-super-secret-key-change-this-in-production
NODE_ENV=development
PORT=3000
```

## Step 3: Fix Database (Important!)
This removes old indexes that cause E11000 errors:
```bash
node scripts/fix-db.js
```

## Step 4: Start the Server
```bash
npm start
```

The application will be available at: **http://localhost:3000**

---

## 🔐 Authentication Flow

### Register
1. Click "Sign up" on the login page
2. Enter username (2-30 chars), email, and password (6+ chars)
3. Click "Create Account"
4. You'll be logged in automatically

### Login
1. Enter your username and password
2. Click "Login"
3. You'll be directed to the chat

### Logout
1. Click the user avatar icon (top right of chat header)
2. Click "Logout" from the dropdown menu

---

## 💬 Chat Features

### Create a Room
1. Click the **+** button in the Chat Rooms sidebar
2. Enter room name and description
3. Click "Create"
4. Room will appear in the list

### Send Messages
1. Select a room from the sidebar
2. Type your message in the input box
3. Press Enter or click Send
4. Messages appear in real-time

### User Presence
- Online count shows in the chat header
- User names display above messages from other users

---

## 📁 Project Structure

```
SMS/
├── models/
│   ├── User.js           # User schema with bcrypt hashing
│   ├── ChatRoom.js       # Chat room schema
│   └── Message.js        # Message schema
├── routes/
│   ├── auth.js           # Authentication endpoints
│   ├── chatRooms.js      # Room management APIs
│   └── messages.js       # Message history APIs
├── public/
│   ├── index.html        # Main UI (login/register/chat)
│   ├── js/
│   │   └── app.js        # Frontend logic
│   └── style/
│       ├── container.css # Glassmorphism styles
│       └── main.css      # Additional styles
├── scripts/
│   ├── fix-db.js         # Fix E11000 errors
│   ├── init-db.js        # Initialize database
│   └── test-api.js       # Test API endpoints
├── server.js             # Express + Socket.IO server
├── .env                  # Environment variables
└── package.json          # Dependencies
```

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/logout` - End session
- `GET /api/auth/me` - Get current user info

### Chat Rooms
- `GET /api/chatrooms` - List all rooms
- `POST /api/chatrooms` - Create new room
- `GET /api/chatrooms/:name` - Get room details

### Messages
- `GET /api/messages/:roomId` - Get message history (paginated)

---

## ⚠️ Troubleshooting

### MongoDB Connection Error
- Check `MONGO_URI` in `.env`
- Ensure MongoDB is running
- For Atlas, verify IP whitelist

### E11000 Duplicate Key Error
- Run: `node scripts/fix-db.js`
- This removes old indexes

### Socket.IO Connection Failed
- Check firewall settings
- Ensure port 3000 is accessible
- Try clearing browser cache

### Cannot Login
- Verify credentials are correct
- Check email is unique
- Try logging in with different browser/incognito

---

## 🎨 Design Features

- **Glassmorphism UI** - Modern frosted glass effect
- **Dark Theme** - Easy on the eyes
- **Responsive Design** - Works on desktop and mobile
- **Real-time Updates** - Live message sync
- **User Authentication** - Secure password hashing
- **Session Management** - Cookie-based auth

---

## 🚀 Deployment

### For Production
1. Set `NODE_ENV=production` in `.env`
2. Use MongoDB Atlas (not local)
3. Set secure `SESSION_SECRET`
4. Deploy to: Heroku, Railway, or AWS

### Environment Variables
```env
MONGO_URI=mongodb+srv://...
SESSION_SECRET=your-production-secret-key
NODE_ENV=production
PORT=3000
```

---

## 📝 Notes

- Messages are persisted in MongoDB
- Sessions last 24 hours
- Passwords are hashed with bcryptjs
- Emails must be unique
- Usernames must be unique
- XSS protection on all message inputs

---

## ❓ Support

For issues or questions, check:
- `README.md` - Overview
- `QUICKSTART.md` - Quick start guide
- `IMPLEMENTATION.md` - Technical details
- `DEPLOYMENT.md` - Production setup

**Happy chatting! 🎉**
