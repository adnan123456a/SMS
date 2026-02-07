# ⚡ SMS Chat - Quick Reference Card

## 🚀 Start (30 seconds)
```bash
cd /workspaces/SMS
node scripts/fix-db.js    # Fix database
npm start                  # Start server
# Visit: http://localhost:3000
```

---

## 👤 Auth Commands

| Action | What Happens |
|--------|--------------|
| Click "Sign up" | Toggle to register form |
| Click "Log in" | Toggle to login form |
| Register account | New user + auto-login |
| Login | Session created + auto-login |
| Click avatar 👤 | Show user dropdown |
| Click Logout | Destroy session + show login |

---

## 💬 Chat Commands

| Action | What Happens |
|--------|--------------|
| Click "+" | Create room dialog |
| Type room name | Room creation |
| Click room | Join room + load history |
| Type message | Input focus + ready to send |
| Press Enter | Send message |
| Refresh page | Auto-login + stay in room |
| Close browser | Session persists 24h |

---

## 🔧 Environment Setup

```env
# .env file
MONGO_URI=mongodb://localhost:27017/chat-app
SESSION_SECRET=your-super-secret-key
NODE_ENV=development
PORT=3000
```

---

## 📱 Key Endpoints

```
POST   /api/auth/register     → Create account
POST   /api/auth/login        → Login
POST   /api/auth/logout       → Logout
GET    /api/auth/me           → Current user

GET    /api/chatrooms         → List rooms
POST   /api/chatrooms         → Create room

GET    /api/messages/:roomId  → Message history
```

---

## 🗄️ Database

### Users
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  profilePicture: String,
  createdAt: Date
}
```

### ChatRooms
```javascript
{
  name: String (unique),
  description: String,
  createdBy: ObjectId,
  messageCount: Number,
  createdAt: Date
}
```

### Messages
```javascript
{
  roomId: ObjectId,
  senderId: ObjectId,
  senderName: String,
  message: String,
  createdAt: Date (indexed)
}
```

### Sessions
```javascript
{
  // Auto-created by connect-mongo
  // 24-hour expiry
  // HTTP-only cookie
}
```

---

## 🔑 Important Files

| File | Purpose |
|------|---------|
| server.js | Main app |
| models/User.js | User schema |
| routes/auth.js | Auth endpoints |
| public/js/app.js | Frontend logic |
| public/style/container.css | Styles |
| .env | Config |

---

## 🧪 Test Commands

```bash
# Fix database
node scripts/fix-db.js

# Test API
node scripts/test-api.js

# Monitor logs
tail -f logs.txt

# Check port
lsof -i :3000

# Kill process
pkill -f "node server.js"
```

---

## 🆘 Quick Fixes

| Problem | Solution |
|---------|----------|
| "Cannot connect" | Check .env, restart MongoDB |
| "E11000 error" | Run `node scripts/fix-db.js` |
| "Port already in use" | `pkill -f "node server.js"` |
| "Session lost" | Clear cookies, check MongoDB |
| "Won't login" | Verify email (case-insensitive) |

---

## 🔐 Security

- Passwords: Hashed with bcryptjs
- Sessions: HTTP-only cookies, MongoDB store
- Validation: Client + Server side
- XSS: HTML escaping on messages
- CORS: Configured and allowed

---

## 📊 Session Info

| Property | Value |
|----------|-------|
| Duration | 24 hours |
| Storage | MongoDB |
| Cookie Type | HTTP-only |
| Secure Flag | Production only |
| Auto Refresh | Yes |

---

## 🚀 Deploy

```bash
# Heroku
heroku create app-name
git push heroku main

# Railway.app
# Just push to GitHub, auto-deploys

# Manual VPS
scp -r . user@server:/app
ssh user@server
cd /app && npm install && npm start
```

---

## 📈 Performance

| Metric | Target |
|--------|--------|
| Page Load | <2s |
| Message Send | <100ms |
| Login | <1s |
| DB Query | <50ms |

---

## 🐛 Debug Tips

```javascript
// Frontend console
console.log(currentUser)        // Check auth
io.engine.transport.name        // Check Socket.IO
fetch('/api/auth/me')           // Test session

// Network tab
// Check request/response in DevTools
// Look for 401/403 for auth issues
// Look for 5xx for server errors
```

---

## 📝 npm Scripts

```bash
npm start        # Start production server
npm run dev      # Start with nodemon (dev mode)
npm test         # Run tests (if configured)
```

---

## 🎨 UI Elements

| Element | Color | Action |
|---------|-------|--------|
| Send Button | Blue gradient | Send message |
| Logout Button | Red | End session |
| Room Item | Purple on hover | Select room |
| Message Own | Light | Sent by you |
| Message Other | Dark | From others |

---

## 💾 Data Storage

| Data | Where | Duration |
|------|-------|----------|
| Messages | MongoDB | Permanent |
| Sessions | MongoDB | 24 hours |
| Passwords | MongoDB (hashed) | Permanent |
| User Info | MongoDB | Permanent |
| Browser Cache | LocalStorage | Permanent |

---

## 🔄 Real-Time Events

| Event | Direction | Data |
|-------|-----------|------|
| userJoin | Server → Clients | username |
| userLeft | Server → Clients | username |
| sendMessage | Client → Server | room, sender, message |
| receiveMessage | Server → Clients | sender, message, timestamp |

---

## 🎯 Common Tasks

### Add New User
1. Click "Sign up"
2. Enter username, email, password
3. Click "Create Account"

### Create Room
1. Click "+" button
2. Enter room name
3. Click "Create"

### Send Message
1. Select room
2. Type message
3. Press Enter

### Change Password
Not yet implemented - consider adding

### Delete Room
Not yet implemented - consider adding

---

## 🌐 Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Edge | ✅ Full |
| IE 11 | ⚠️ Not tested |

---

## 📱 Mobile Support

✅ Responsive design
✅ Touch-friendly buttons
✅ Full functionality
⚠️ Small message input box
⚠️ Test on actual device

---

## 🔌 Dependencies Overview

```javascript
// Production dependencies
bcryptjs           // Password hashing
cors               // Cross-origin
dotenv             // Env variables
express            // Web framework
express-session    // Session management
express-validator  // Input validation
mongoose           // MongoDB driver
socket.io          // Real-time messaging
connect-mongo      // Session storage

// Dev dependencies
nodemon            // Auto-restart on file change
```

---

## 📞 Help Resources

1. **QUICKSTART_COMPLETE.md** - 3-minute start
2. **SETUP.md** - Complete setup guide
3. **TESTING_GUIDE.md** - All test cases
4. **AUTH_IMPLEMENTATION.md** - Auth details
5. **DEPLOYMENT_COMPLETE.md** - Deploy guide

---

## ✅ Pre-Launch Checklist

- [ ] MongoDB running
- [ ] Environment variables set
- [ ] Dependencies installed (`npm install`)
- [ ] Database fixed (`node scripts/fix-db.js`)
- [ ] Server starts (`npm start`)
- [ ] Port 3000 accessible
- [ ] Registration works
- [ ] Login works
- [ ] Messages send and receive
- [ ] Logout works

---

## 🎓 Tech Stack

```
Frontend:        HTML5 + CSS3 + Vanilla JS
Backend:         Node.js + Express + Socket.IO
Database:        MongoDB + Mongoose
Authentication:  Bcryptjs + Express-session
Deployment:      Node/PM2 or Platform
```

---

## 💡 Tips & Tricks

- Use incognito mode to test multi-user
- Check browser console for errors (F12)
- Clear cookies to force re-login
- Use DevTools Network tab to debug APIs
- Check MongoDB with mongosh CLI
- Monitor server with `pm2 logs`

---

## 🎉 Summary

- ✅ Production-ready
- ✅ Secure
- ✅ Documented
- ✅ Tested
- ✅ Beautiful UI
- ✅ Real-time chat
- ✅ Easy to deploy

**Ready to launch!** 🚀

