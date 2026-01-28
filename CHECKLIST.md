# ✅ Getting Started Checklist

## Pre-Flight Check

### Prerequisites Installed
- [ ] Node.js (v14+) – Check with `node -v`
- [ ] npm (v6+) – Check with `npm -v`
- [ ] MongoDB – Local or Atlas account

### Project Setup
- [ ] Dependencies installed – `npm install` ✅ (already done)
- [ ] `.env` file created ✅ (already done)
- [ ] All model files created ✅
- [ ] All route files created ✅
- [ ] Frontend files updated ✅
- [ ] Server configuration complete ✅

---

## Step 1: Configure MongoDB

### Choose Your Setup:

#### Option A: Local MongoDB (Easiest for Development)
```bash
# Make sure MongoDB is running
# Linux/Mac
brew services start mongodb-community

# Windows
# Use MongoDB Community Edition installer or Docker

# Verify connection
mongosh  # Should connect to MongoDB
```

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster (free tier)
4. Get connection string (click "Connect")
5. Copy string like: `mongodb+srv://user:pass@cluster.mongodb.net/chat-app`
6. Update `.env`:
```env
MONGO_URI=mongodb+srv://YOUR_STRING_HERE
PORT=3000
NODE_ENV=development
```

**Test connection:**
```bash
# If MongoDB is running locally, this should work:
mongosh
> show databases
```

---

## Step 2: Verify Installation

```bash
# Navigate to project
cd /workspaces/SMS

# Check dependencies installed
npm list

# You should see:
# ├── cors
# ├── dotenv
# ├── express
# ├── mongoose
# ├── nodemon
# └── socket.io
```

---

## Step 3: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# OR production mode
npm start
```

**Expected output:**
```
🚀 Server running on port 3000
✅ MongoDB connected
```

If you see errors:
- ❌ **"MongoDB connection error"** → MongoDB isn't running
- ❌ **"Cannot find module"** → Run `npm install`
- ❌ **"Port 3000 already in use"** → Use different port: `PORT=3001 npm start`

---

## Step 4: Open in Browser

```
http://localhost:3000
```

You should see:
- ✅ Chat Room login screen
- ✅ Username input field
- ✅ "Join Chat" button

---

## Step 5: Test Basic Functionality

### Single User Test
1. **Enter username** – Type "alice"
2. **Click "Join Chat"** – Go to main interface
3. **Create room** – Click `+` button, enter "general"
4. **Type message** – Enter "Hello World!"
5. **Send message** – Press Enter or click Send
6. **See message** – Should appear in chat

### Multi-User Test
1. **Open 2nd browser tab** – `http://localhost:3000`
2. **Enter username** – Type "bob"
3. **Join same room** – Click "general"
4. **Send message from tab 1** – "Hi Bob!"
5. **See in tab 2** – Message appears in real-time ✨
6. **Reply from tab 2** – "Hi Alice!"
7. **Confirm in tab 1** – Real-time message sync works!

---

## Step 6: Test API Endpoints

Run the test script:
```bash
node scripts/test-api.js
```

Or use curl:
```bash
# Get all rooms
curl http://localhost:3000/api/chatrooms

# Create a room
curl -X POST http://localhost:3000/api/chatrooms \
  -H "Content-Type: application/json" \
  -d '{"name":"test","description":"test room","createdBy":"alice"}'
```

---

## Step 7: Explore Features

### Try These:
- [ ] Create multiple rooms
- [ ] Join different rooms
- [ ] Send long messages
- [ ] Open on mobile device
- [ ] Check message history
- [ ] Test browser back button
- [ ] Close/reopen browser (persist data)

### Features Working:
- [ ] ✅ Real-time messaging
- [ ] ✅ Room creation
- [ ] ✅ Room persistence
- [ ] ✅ Message history
- [ ] ✅ Multi-user sync
- [ ] ✅ Responsive design
- [ ] ✅ Auto-scroll
- [ ] ✅ Timestamps

---

## Step 8: Database Inspection

### View Database (MongoDB Compass)
1. Install [MongoDB Compass](https://www.mongodb.com/products/tools/compass)
2. Connect to: `mongodb://localhost:27017`
3. Browse:
   - `chat-app` database
   - `users` collection
   - `chatrooms` collection
   - `messages` collection

### Or via CLI
```bash
mongosh
> use chat-app
> db.chatrooms.find()
> db.messages.find()
> db.users.find()
```

---

## Step 9: Ready for Deployment?

### Before Deploying:
- [ ] Test all features locally ✅
- [ ] Check for console errors
- [ ] Verify `.env` settings
- [ ] Create admin user (optional)
- [ ] Test on different devices

### Deployment Options:
See `DEPLOYMENT.md` for:
- ☁️ Heroku (simplest)
- ☁️ Railway
- ☁️ Render
- 🖥️ VPS (Ubuntu/Debian)
- 🐳 Docker

Quick Heroku deploy:
```bash
heroku login
heroku create your-app-name
heroku config:set MONGO_URI="your_atlas_uri"
git push heroku main
```

---

## Step 10: Customize (Optional)

### Change Colors
Edit `/public/style/container.css`:
```css
/* Find and change gradients */
background: linear-gradient(135deg, #667eea, #764ba2);
```

### Change Port
Edit `.env` or run:
```bash
PORT=5000 npm start
```

### Change App Title
Edit `/public/index.html`:
```html
<title>Your Chat App Name</title>
```

---

## 🆘 Troubleshooting

### Problem: "MongoDB connection error"
**Solutions:**
1. Check MongoDB is running
2. Verify MONGO_URI in `.env`
3. Test connection: `mongosh`
4. Check Atlas firewall settings (if using Atlas)

### Problem: "Port 3000 already in use"
**Solutions:**
```bash
# Use different port
PORT=3001 npm start

# Or kill process using port 3000
lsof -i :3000  # Find PID
kill -9 <PID>  # Kill it
```

### Problem: "Cannot GET /"
**Solutions:**
1. Make sure server is running
2. Check console for errors
3. Clear browser cache (Ctrl+F5)
4. Check network tab in DevTools

### Problem: "Messages not syncing"
**Solutions:**
1. Check browser console for errors
2. Check server console for errors
3. Verify socket.io is connected
4. Try opening in incognito mode

### Problem: "Socket.IO disconnects"
**Solutions:**
1. Check firewall/network settings
2. Ensure WebSocket support enabled
3. Check proxy settings
4. Try different browser

---

## 📊 Performance Tips

If running slowly:
- [ ] Clear browser cache
- [ ] Restart server
- [ ] Check disk space
- [ ] Close other apps
- [ ] Use development mode (`npm run dev`)

If database is slow:
- [ ] Add MongoDB indexes
- [ ] Limit message history (pagination)
- [ ] Cache frequently accessed data
- [ ] Consider Redis for caching

---

## 🔒 Security Reminders

Before deployment:
- [ ] Enable HTTPS/SSL
- [ ] Set `NODE_ENV=production`
- [ ] Use strong database credentials
- [ ] Implement authentication (JWT)
- [ ] Add rate limiting
- [ ] Enable CORS properly
- [ ] Keep dependencies updated

Run security check:
```bash
npm audit
npm audit fix
```

---

## 📚 Documentation References

| Document | Use Case |
|----------|----------|
| **README.md** | Full feature docs & API reference |
| **QUICKSTART.md** | 5-minute quick start |
| **ARCHITECTURE.md** | System design & data flow |
| **DEPLOYMENT.md** | Production deployment |
| **IMPLEMENTATION.md** | Technical details |
| **START_HERE.md** | Overview & features |
| **This file** | Setup checklist |

---

## ✨ Common Next Steps

### Immediate (Today)
1. ✅ Follow steps 1-7 above
2. ✅ Test multi-user functionality
3. ✅ Explore the code

### This Week
4. Customize colors/theme
5. Add user profiles
6. Implement typing indicators
7. Add message search

### This Month
8. Deploy to production
9. Add authentication system
10. Scale to more users
11. Add message reactions

---

## 🎓 Learning Resources

While using the app, learn about:
- [Socket.IO Real-Time Apps](https://socket.io/)
- [Express.js Best Practices](https://expressjs.com/)
- [MongoDB Atlas Guide](https://docs.mongodb.com/manual/)
- [Mongoose Validation](https://mongoosejs.com/)
- [Modern CSS Techniques](https://developer.mozilla.org/en-US/docs/Web/CSS/)

---

## 💬 Need Help?

### Quick Help
1. Check `README.md` – Most questions answered
2. Check `QUICKSTART.md` – Quick reference
3. Check browser console – Error details
4. Check server console – Server errors

### Common Issues
- MongoDB not running → Start MongoDB
- Port in use → Change port
- Socket.IO error → Restart server
- UI broken → Clear cache & refresh

### For Deployment Issues
- See `DEPLOYMENT.md`
- Check hosting provider docs
- Verify environment variables
- Check logs in hosting dashboard

---

## 🚀 You're Ready!

When you see this, you're all set:
```
✅ Server running on port 3000
✅ MongoDB connected
✅ App loaded in browser
✅ Real-time messages working
```

**Let's chat! 🎉**

---

## 📋 Quick Reference

```bash
# Start development
npm run dev

# Start production
npm start

# Test API
node scripts/test-api.js

# Initialize DB (if needed)
node scripts/init-db.js

# Check logs
tail -f server.log  # (if logging enabled)

# Kill process on port 3000
lsof -i :3000 | grep -v COMMAND | awk '{print $2}' | xargs kill -9
```

---

**Last verified: January 2026**  
**Status: ✅ Ready to Use**  
**Questions? Check the documentation files!**
