# 🌸 Anime Chat Room 🌸

A beautiful, anime-themed real-time chat application built with Node.js and Socket.IO!

## ✨ Features

- **Real-time messaging** using Socket.IO
- **Anime-themed UI** with gradient backgrounds and sakura animations
- **User presence** - see who's online
- **Typing indicators** - see when others are typing
- **Unique avatars** - each user gets a colorful anime-style avatar
- **Smooth animations** - beautiful entrance effects for messages
- **Responsive design** - works on desktop and mobile
- **System notifications** - join/leave announcements

## 🚀 Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

4. **Start chatting!**
   - Enter your username
   - Click "Join Chat Room"
   - Start messaging with others in real-time!

## 🛠️ Technology Stack

- **Backend:** Node.js with Express
- **Real-time Communication:** Socket.IO
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Styling:** Custom CSS with gradient themes and animations

## 📁 Project Structure

```
anime-chat/
├── server.js           # Node.js server with Socket.IO
├── package.json        # Dependencies
└── public/
    └── index.html      # Frontend HTML/CSS/JS
```

## 🎨 Features Explained

### Real-time Messaging
Messages are broadcast instantly to all connected users using Socket.IO websockets.

### Typing Indicators
When a user types, others see a "username is typing..." indicator that disappears after 1 second of inactivity.

### User Management
- Each user gets a unique avatar with a color scheme
- Online user count is displayed in the header
- Join/leave notifications keep everyone informed

### Anime Aesthetics
- Purple gradient theme inspired by anime aesthetics
- Floating sakura (cherry blossom) petals in the background
- Smooth animations and transitions
- Colorful, rounded UI elements

## 🎮 How to Use

1. **Join the chat:** Enter your desired username
2. **Send messages:** Type in the input box and press Enter or click Send
3. **See who's online:** Check the counter in the top-right
4. **Watch for typing:** See when others are composing messages

## 🔧 Customization

You can easily customize:
- **Colors:** Edit the gradient values in the CSS
- **Avatar styles:** Modify the `getAvatarUrl()` function
- **Animation speed:** Adjust the animation durations in CSS
- **Port:** Change `PORT` in server.js

## 📱 Mobile Support

The chat room is fully responsive and works great on mobile devices with an optimized layout.

## 🌟 Future Enhancements

Potential features to add:
- Private messaging
- Chat rooms/channels
- Message history
- Emoji reactions
- Image sharing
- User authentication
- Message editing/deletion
- Sound notifications

## 💖 Enjoy!

Have fun chatting in your kawaii anime chat room! Feel free to customize and extend it as you like!
