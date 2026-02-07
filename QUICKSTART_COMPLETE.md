# ⚡ QUICK START - 3 SIMPLE STEPS

## Step 1️⃣: Fix Database
```bash
cd /workspaces/SMS
node scripts/fix-db.js
```
✅ This removes old database indexes that were causing errors

---

## Step 2️⃣: Start Server
```bash
npm start
```
✅ Server runs on http://localhost:3000

---

## Step 3️⃣: Use the App

### First Time Users
1. Click **"Sign up"** 
2. Create account with:
   - Username (2-30 chars)
   - Email (must be valid)
   - Password (min 6 chars)
3. Click **"Create Account"**
4. ✅ You're logged in!

### Returning Users
1. Enter username and password
2. Click **"Login"**
3. ✅ You're back!

### Using Chat
1. Click **"+"** to create room or select existing room
2. Type message and press **Enter**
3. Click avatar **👤** to logout

---

## 🔑 Features

✅ **Authentication** - Register, login, logout with passwords  
✅ **Real-Time Chat** - Messages sync instantly  
✅ **Persistent** - Messages saved in database  
✅ **Secure** - Password hashing, session cookies  
✅ **User Friendly** - Glassmorphism design  

---

## 🆘 Troubleshooting

**"Cannot connect to MongoDB"**
- Check `.env` file has correct MONGO_URI
- Ensure MongoDB is running

**"E11000 duplicate key error"**
- Run: `node scripts/fix-db.js`
- Delete and recreate user

**"Server not starting"**
- Check port 3000 is free: `lsof -i :3000`
- Ensure all dependencies: `npm install`

**"Login not working"**
- Verify email is registered (case-insensitive)
- Check password is correct
- Try clearing browser cookies

---

## 📞 Files to Read

- **SETUP.md** - Complete setup guide
- **AUTH_IMPLEMENTATION.md** - How auth works
- **FINAL_SUMMARY.md** - Full project summary
- **README.md** - Project overview

---

## 💾 Environment (.env)
```env
MONGO_URI=mongodb://localhost:27017/chat-app
SESSION_SECRET=change-this-in-production
NODE_ENV=development
PORT=3000
```

---

## 🎉 That's It!

Your secure, real-time chat app is ready!

Visit: **http://localhost:3000**

Enjoy chatting! 💬

