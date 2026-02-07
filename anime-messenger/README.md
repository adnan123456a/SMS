# 🌸 Anime Messenger 🌸

A full-featured, anime-themed real-time messenger application with user authentication, room creation, and persistent message storage.

## ✨ Features

### Core Features
- **User Authentication** - Register and login with secure password hashing
- **Session Management** - Cookie-based sessions that persist across browser restarts
- **Room Creation** - Users can create their own chat rooms
- **Room Discovery** - Browse and join available rooms from the homepage
- **Real-time Messaging** - Instant message delivery using Socket.IO
- **Message Persistence** - All messages are stored in MongoDB
- **Auto-deletion** - Messages automatically delete after 3 days
- **Typing Indicators** - See when others are typing
- **Online Status** - See how many users are currently in each room
- **Message History** - Load previous messages when joining a room

### Technical Features
- **Broadcast-then-Save Architecture** - Messages are broadcast in real-time first, then saved to database
- **MongoDB Integration** - All data persisted in MongoDB
- **Express Sessions** - Secure session management with MongoDB store
- **Password Security** - Bcrypt hashing for passwords
- **Protected Routes** - Authentication middleware protects all routes
- **Responsive Design** - Works on desktop and mobile devices

### UI/UX Features
- **Anime Aesthetic** - Beautiful purple gradient theme with sakura animations
- **Smooth Animations** - Entrance effects for messages and UI elements
- **User Avatars** - Colorful auto-generated avatars for each user
- **Real-time Updates** - Room list auto-refreshes every 10 seconds
- **System Notifications** - Join/leave announcements in chat rooms

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

### Step 1: Install MongoDB

**On macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**On Ubuntu/Debian:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**On Windows:**
Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

### Step 2: Setup Application

1. **Extract the project files**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env file (optional):**
   ```env
   MONGODB_URI=mongodb://localhost:27017/anime-messenger
   SESSION_SECRET=your-super-secret-anime-key-change-this
   PORT=3000
   ```
   
   **Important:** Change the `SESSION_SECRET` to a random string for production!

5. **Start the server:**
   ```bash
   npm start
   ```

6. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📖 How to Use

### First Time Setup
1. **Register an Account**
   - Go to the login page
   - Click "Register here"
   - Choose a username (3-20 characters)
   - Choose a password (minimum 6 characters)
   - Click "Register"

2. **Create Your First Room**
   - After logging in, you'll see the home page
   - Click "+ Create Room"
   - Enter a room name and optional description
   - Click "Create Room"

3. **Start Chatting**
   - Click on any room card to join
   - Type your message and press Enter or click Send
   - Messages appear instantly for all users in the room!

### Using the Messenger
- **Browse Rooms:** The home page shows all available rooms
- **Join Rooms:** Click any room card to enter and start chatting
- **See Online Users:** Check the counter in the chat header
- **View History:** Previous messages (up to 3 days old) load when you join
- **Typing Status:** See when others are typing in real-time
- **Auto-refresh:** Room list updates automatically every 10 seconds

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **cookie-parser** - Cookie parsing
- **connect-mongo** - MongoDB session store

### Frontend
- **Vanilla JavaScript** - No frameworks, pure JS
- **HTML5 & CSS3** - Modern web standards
- **Socket.IO Client** - Real-time client library
- **UI Avatars API** - Auto-generated user avatars

## 📁 Project Structure

```
anime-messenger/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env.example          # Environment variables template
├── models/
│   ├── User.js           # User model (username, password, avatar)
│   ├── Room.js           # Room model (name, description, members)
│   └── Message.js        # Message model (with 3-day auto-delete)
├── public/
│   ├── login.html        # Login/Register page
│   ├── index.html        # Home page with room list
│   ├── chat.html         # Chat room page
│   ├── css/
│   │   ├── auth.css      # Login/Register styles
│   │   ├── home.css      # Home page styles
│   │   └── chat.css      # Chat room styles
│   └── js/
│       ├── auth.js       # Login/Register logic
│       ├── home.js       # Home page logic
│       └── chat.js       # Chat room logic with Socket.IO
└── README.md             # This file
```

## 🔒 Security Features

- **Password Hashing:** Bcrypt with salt rounds
- **Session Security:** HTTP-only cookies
- **Input Validation:** Server-side validation for all inputs
- **SQL Injection Protection:** Mongoose query sanitization
- **XSS Protection:** HTML escaping on all user inputs
- **Protected Routes:** Middleware checks authentication on all protected pages

## 🎨 Architecture Highlights

### Real-time Message Flow
1. User types message and clicks Send
2. Message is **immediately broadcast** to all users in room via Socket.IO
3. Message is displayed in real-time for all users
4. Message is then **saved to MongoDB** in the background
5. This ensures instant delivery while maintaining persistence

### 3-Day Auto-Delete
- Messages have a TTL (Time To Live) index in MongoDB
- MongoDB automatically deletes messages after 259,200 seconds (3 days)
- No cron jobs or manual cleanup required!

### Session Management
- Sessions stored in MongoDB (not in memory)
- Survives server restarts
- Cookies last for 7 days
- Secure and scalable

## 🎮 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/user` - Get current user (requires auth)

### Rooms
- `POST /api/rooms` - Create new room (requires auth)
- `GET /api/rooms` - Get all rooms (requires auth)
- `GET /api/rooms/:roomId/messages` - Get room messages (requires auth)

### Protected Pages
- `GET /` - Home page (requires auth, redirects to /login.html)
- `GET /chat.html` - Chat room (requires auth, redirects to /login.html)

## 🔧 Socket.IO Events

### Client → Server
- `join room` - Join a chat room
- `chat message` - Send a message
- `typing` - Notify others user is typing
- `stop typing` - Notify others user stopped typing
- `disconnect` - User disconnected

### Server → Client
- `room joined` - Confirmation of joining room
- `chat message` - New message received
- `user joined` - User joined the room
- `user left` - User left the room
- `update online count` - Online count changed
- `typing` - Someone is typing
- `stop typing` - Someone stopped typing
- `error` - Error message

## 🌟 Customization

### Change Color Scheme
Edit the gradient values in CSS files:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Change Avatar Colors
Edit the colors array in `chat.js` and `home.js`:
```javascript
const colors = ['FF6B9D', '667eea', 'FFA500', '20E3B2', 'F368E0', '00D2FF', 'FFD93D', 'A8E6CF'];
```

### Adjust Message Retention
Edit the TTL in `models/Message.js`:
```javascript
expires: 259200 // 3 days in seconds
```

### Change Session Duration
Edit the cookie maxAge in `server.js`:
```javascript
maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days in milliseconds
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod` or `brew services list`
- Check the connection string in `.env`
- Default: `mongodb://localhost:27017/anime-messenger`

### Port Already in Use
- Change the PORT in `.env` file
- Or kill the process using port 3000: `lsof -ti:3000 | xargs kill -9`

### Session Issues
- Clear browser cookies
- Restart the server
- Check MongoDB session store is working

### Messages Not Appearing
- Check browser console for errors
- Verify Socket.IO connection (should see "Connected to server" in console)
- Ensure you're in the same room as other users

## 🚀 Deployment Tips

### For Production:
1. **Use a production MongoDB instance** (MongoDB Atlas recommended)
2. **Set strong SESSION_SECRET** in environment variables
3. **Enable HTTPS** and set `cookie.secure: true`
4. **Add rate limiting** to prevent abuse
5. **Set up proper logging** for debugging
6. **Use PM2** or similar for process management
7. **Add health check endpoints**

### Environment Variables for Production:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/anime-messenger
SESSION_SECRET=use-a-very-long-random-string-here
PORT=3000
```

## 📈 Future Enhancements

Potential features to add:
- Private/direct messaging
- File and image uploads
- User profiles with bios
- Room categories/tags
- Search functionality
- Message reactions/emojis
- User blocking/reporting
- Admin panel for moderation
- Password reset via email
- OAuth login (Google, Discord, etc.)
- Voice/video chat
- Message editing and deletion
- Read receipts
- Push notifications
- Dark mode toggle

## 💖 Credits

Built with love using:
- Express.js
- Socket.IO
- MongoDB
- Bcrypt
- UI Avatars API
- Google Fonts (Poppins)

## 📝 License

This project is open source and available for educational purposes.

---

**Enjoy your kawaii messenger! 🌸✨**

For issues or questions, feel free to open an issue on the repository!
