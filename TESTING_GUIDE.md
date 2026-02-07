# 🧪 Complete Testing Guide

## Pre-Testing Setup

```bash
cd /workspaces/SMS
npm install
node scripts/fix-db.js  # Fix old database indexes
npm start               # Start server on port 3000
```

Visit: http://localhost:3000

---

## Test 1: Registration Flow

### Test 1.1: Valid Registration
**Steps:**
1. Click "Sign up"
2. Fill:
   - Username: `testuser1`
   - Email: `testuser1@example.com`
   - Password: `password123`
3. Click "Create Account"

**Expected Result:**
- ✅ Account created
- ✅ Logged in automatically
- ✅ Chat interface visible
- ✅ User info shows in dropdown

---

### Test 1.2: Duplicate Username
**Steps:**
1. Already registered? Click "Sign up"
2. Try same username: `testuser1`
3. Different email: `test2@example.com`
4. Password: `password123`

**Expected Result:**
- ❌ Error: "Username already taken"
- Login form still visible

---

### Test 1.3: Duplicate Email
**Steps:**
1. Click "Sign up"
2. Different username: `testuser2`
3. Same email: `testuser1@example.com`
4. Password: `password123`

**Expected Result:**
- ❌ Error: "Email already registered"
- Login form still visible

---

### Test 1.4: Invalid Email
**Steps:**
1. Click "Sign up"
2. Username: `testuser3`
3. Email: `notanemail`
4. Password: `password123`

**Expected Result:**
- ❌ Error message on submit (server validation)
- Or browser prevents submission

---

### Test 1.5: Short Password
**Steps:**
1. Click "Sign up"
2. Username: `testuser4`
3. Email: `test4@example.com`
4. Password: `123`

**Expected Result:**
- ❌ Error: "Password must be at least 6 characters"
- Form stays open

---

## Test 2: Login Flow

### Test 2.1: Valid Login
**Steps:**
1. Click "Log in" if on register
2. Username: `testuser1`
3. Password: `password123`
4. Click "Login"

**Expected Result:**
- ✅ Successfully logged in
- ✅ Chat interface shown
- ✅ Username visible in dropdown

---

### Test 2.2: Wrong Password
**Steps:**
1. Username: `testuser1`
2. Password: `wrongpassword`
3. Click "Login"

**Expected Result:**
- ❌ Error: "Invalid password" or similar
- Login form still visible
- Can retry

---

### Test 2.3: Non-existent User
**Steps:**
1. Username: `nonexistentuser`
2. Password: `password123`
3. Click "Login"

**Expected Result:**
- ❌ Error: "User not found"
- Login form still visible

---

### Test 2.4: Empty Fields
**Steps:**
1. Leave fields empty
2. Click "Login"

**Expected Result:**
- ❌ Error: "Username and password are required"
- Login form still visible

---

## Test 3: Chat Functionality

### Test 3.1: Create Room
**Steps:**
1. Logged in and viewing chat
2. Click "+" button in sidebar
3. Room name: `Test Room`
4. Description: `A test room`
5. Click "Create"

**Expected Result:**
- ✅ Room appears in list
- ✅ Auto-selected
- ✅ Chat header shows room name
- ✅ Empty messages state shown

---

### Test 3.2: Send Message
**Steps:**
1. Select a room
2. Type: `Hello, this is a test message!`
3. Press Enter or click Send

**Expected Result:**
- ✅ Message appears in chat
- ✅ Shows your username
- ✅ Shows timestamp
- ✅ Input clears
- ✅ Auto-scrolls to bottom

---

### Test 3.3: Message Persistence
**Steps:**
1. Send a message
2. Refresh page (F5)
3. Login again
4. Select same room

**Expected Result:**
- ✅ Previous message still there
- ✅ Message history loaded
- ✅ Timestamp preserved

---

### Test 3.4: Multiple Rooms
**Steps:**
1. Create Room A and send message "A"
2. Create Room B and send message "B"
3. Click Room A

**Expected Result:**
- ✅ Message "A" visible
- ✅ Room name updated
- ✅ Messages don't mix

---

## Test 4: User Dropdown Menu

### Test 4.1: Open Dropdown
**Steps:**
1. In chat, click avatar 👤 in header

**Expected Result:**
- ✅ Dropdown appears
- ✅ Shows username
- ✅ Shows email
- ✅ Logout button visible

---

### Test 4.2: Close Dropdown
**Steps:**
1. Open dropdown
2. Click elsewhere on page

**Expected Result:**
- ✅ Dropdown closes automatically

---

## Test 5: Logout

### Test 5.1: Logout and Login Again
**Steps:**
1. Click avatar 👤
2. Click "Logout"
3. Should see login form

**Expected Result:**
- ✅ Logged out
- ✅ Session destroyed
- ✅ Login form shown
- ✅ Can login again with same credentials

---

### Test 5.2: Auto-Logout After 24 Hours
**Note:** Requires waiting 24 hours, or manually test with:
```javascript
// In browser console
JSON.stringify(new Date(Date.now() + 86400000))
```

**Expected:** Session cookie expires after 24 hours

---

## Test 6: Session Persistence

### Test 6.1: Refresh Page
**Steps:**
1. Logged in and in a room
2. Press F5 to refresh
3. Wait for page to load

**Expected Result:**
- ✅ Still logged in
- ✅ Session cookie persists
- ✅ User info loaded
- ✅ No need to login again

---

### Test 6.2: New Tab
**Steps:**
1. Login in one tab
2. Open new tab to same URL
3. Don't login in new tab

**Expected Result:**
- ✅ New tab recognizes session
- ✅ Already logged in
- ✅ Can use chat immediately

---

## Test 7: Security

### Test 7.1: Password Never Visible
**Steps:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Login

**Expected Result:**
- ✅ Password not sent in GET
- ✅ Password sent via POST (HTTPS in production)
- ✅ Session cookie httpOnly (can't access via JS)

---

### Test 7.2: XSS Protection
**Steps:**
1. Try sending message with HTML: `<script>alert('XSS')</script>`
2. Or: `<img src=x onerror=alert('XSS')>`

**Expected Result:**
- ✅ HTML escaped
- ✅ Appears as plain text
- ✅ No alert appears

---

## Test 8: Form Validation

### Test 8.1: Client-Side Validation
**Steps:**
1. Click "Sign up"
2. Try username with 1 char
3. Try password with 3 chars

**Expected Result:**
- ✅ Browser shows "minlength" errors
- ✅ Can't submit with invalid data

---

### Test 8.2: Server-Side Validation
**Steps:**
1. Open DevTools Console
2. Submit form with bypassed validation
3. Or use curl:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"a","email":"invalid","password":"123"}'
```

**Expected Result:**
- ✅ Server rejects
- ✅ Error message returned
- ✅ Database not modified

---

## Test 9: Performance

### Test 9.1: Message Loading
**Steps:**
1. Send 50+ messages
2. Select different room and back
3. Message history loads

**Expected Result:**
- ✅ Loads in <2 seconds
- ✅ Shows last 50 messages
- ✅ No lag

---

### Test 9.2: Room List
**Steps:**
1. Create 20+ rooms
2. Scroll through list

**Expected Result:**
- ✅ Smooth scrolling
- ✅ No freezing
- ✅ Fast load time

---

## Test 10: Edge Cases

### Test 10.1: Very Long Message
**Steps:**
1. Send 1000+ character message
2. Check rendering

**Expected Result:**
- ✅ Message wraps properly
- ✅ No overflow
- ✅ Readable

---

### Test 10.2: Special Characters
**Steps:**
1. Send: `!@#$%^&*()_+-=[]{}|;':",./<>?`
2. Send: `émojis 🎉 🚀 💬`

**Expected Result:**
- ✅ Display correctly
- ✅ No errors
- ✅ Encoded properly

---

### Test 10.3: Rapid Messages
**Steps:**
1. Send 10 messages quickly
2. Refresh page

**Expected Result:**
- ✅ All messages appear
- ✅ Correct order
- ✅ No duplicates

---

## Test 11: Multi-User Simulation

### Test 11.1: Two Users (Two Browsers)
**Steps:**
1. Open incognito window in Firefox
2. Register user: `user2`
3. In Chrome, register user: `user1`
4. Both join same room
5. User1 sends message
6. Check User2 receives it

**Expected Result:**
- ✅ Message appears in real-time
- ✅ Both see same messages
- ✅ Both see each other's user info

---

## Test 12: Error Recovery

### Test 12.1: Network Disconnection
**Steps:**
1. In DevTools Network tab
2. Set to "Offline"
3. Try sending message
4. Go back "Online"

**Expected Result:**
- ✅ Error handling graceful
- ✅ Can reconnect
- ✅ No data loss

---

### Test 12.2: Server Restart
**Steps:**
1. Stop server (Ctrl+C)
2. Try using app
3. Restart server

**Expected Result:**
- ✅ Connection error shown
- ✅ Auto-reconnect works
- ✅ Resume session

---

## Test Summary Checklist

- [ ] Test 1: Registration (5 tests)
- [ ] Test 2: Login (4 tests)
- [ ] Test 3: Chat (4 tests)
- [ ] Test 4: Dropdown (2 tests)
- [ ] Test 5: Logout (2 tests)
- [ ] Test 6: Session (2 tests)
- [ ] Test 7: Security (2 tests)
- [ ] Test 8: Validation (2 tests)
- [ ] Test 9: Performance (2 tests)
- [ ] Test 10: Edge Cases (3 tests)
- [ ] Test 11: Multi-User (1 test)
- [ ] Test 12: Error Recovery (2 tests)

**Total: 34 Tests**

---

## Automated Testing (Optional)

Run API tests:
```bash
node scripts/test-api.js
```

---

## Production Checklist

- [ ] All 34 tests pass
- [ ] No console errors
- [ ] No console warnings
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Passwords properly hashed
- [ ] Sessions stored in MongoDB
- [ ] No sensitive data in logs
- [ ] Error messages user-friendly
- [ ] UI responsive on mobile

---

## Sign-Off

Once all tests pass, the application is ready for:
- ✅ Production deployment
- ✅ User access
- ✅ Scaling

🎉 **Happy Testing!**

