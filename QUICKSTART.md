# ⚡ Quick Start Guide

Get the chat app running in **5 minutes**!

## 1️⃣ Install Dependencies
```bash
npm install
```

## 2️⃣ Setup MongoDB

### Option A: Local MongoDB
```bash
# Make sure MongoDB is running on your machine
# Default: mongodb://localhost:27017/chat-app
```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account & cluster
3. Get connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/chat-app`)
4. Update `.env`:
```env
MONGO_URI=mongodb+srv://YOUR_CONNECTION_STRING
PORT=3000
```

## 3️⃣ Start the Server
```bash
# Development (with auto-reload)
npm run dev

# OR Production
npm start
```

You'll see:
```
🚀 Server running on port 3000
✅ MongoDB connected
```

## 4️⃣ Open in Browser
```
http://localhost:3000
```

## 5️⃣ Test It Out!
1. **Enter username** – Type any name (e.g., "Alice")
2. **Create a room** – Click `+` button, enter room name
3. **Send messages** – Type and press Enter
4. **Multiple users** – Open in another tab/window with different username

---

## 📱 Testing Multi-User Chat

Open **two browser windows**:

**Window 1:**
- Visit `http://localhost:3000`
- Username: "alice"
- Join "general" room
- Send: "Hello from Alice!"

**Window 2:**
- Visit `http://localhost:3000`
- Username: "bob"
- Join "general" room
- Send: "Hi Alice!"

You'll see messages sync in **real-time**! ✨

---

## 🐛 Common Issues

### ❌ "MongoDB connection error"
**Fix:**
- Make sure MongoDB is running
- Check `MONGO_URI` in `.env`
- For MongoDB Atlas: whitelist your IP

### ❌ "Cannot POST /api/chatrooms"
**Fix:**
- Restart server
- Clear browser cache

### ❌ "Socket.IO connection failed"
**Fix:**
- Make sure server is running
- Check if port 3000 is available
- Try different port: `PORT=3001 npm start`

---

## 📂 Project Structure Quick Reference

```
server.js              ← Express + Socket.IO server
models/
  ├── User.js         ← User data schema
  ├── ChatRoom.js     ← Chat room schema
  └── Message.js      ← Message data schema
routes/
  ├── chatRooms.js    ← REST API for rooms
  └── messages.js     ← REST API for messages
public/
  ├── index.html      ← Main UI
  ├── js/app.js       ← Frontend logic
  └── style/
      └── container.css ← All styles
```

---

## 🚀 Next Steps

After running successfully:

1. **Customize UI** – Edit `/public/style/container.css`
2. **Add Features** – See `DEPLOYMENT.md` for ideas
3. **Deploy** – Follow `DEPLOYMENT.md` for hosting options
4. **Scale** – Add Redis caching, message pagination, etc.

---

## 🎓 Learning Resources

- [Socket.IO Docs](https://socket.io/docs/)
- [Express Guide](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)

---

## ✨ You're All Set!

**Happy Chatting! 🎉**

Need help? Check the `README.md` for full documentation.
