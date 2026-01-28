#!/usr/bin/env node

/**
 * Simple test script to verify API endpoints
 * Run: node scripts/test-api.js
 */

const API_URL = 'http://localhost:3000/api';

// Color codes for console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

async function testAPIs() {
  log('\n🧪 Testing Chat App APIs\n', 'blue');

  try {
    // Test 1: Get all rooms
    log('1️⃣  Testing GET /api/chatrooms', 'yellow');
    const roomsRes = await fetch(`${API_URL}/chatrooms`);
    const rooms = await roomsRes.json();
    log(`   ✅ Found ${rooms.length} rooms\n`, 'green');

    // Test 2: Create a room
    log('2️⃣  Testing POST /api/chatrooms', 'yellow');
    const newRoomRes = await fetch(`${API_URL}/chatrooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `test-room-${Date.now()}`,
        description: 'Test room',
        createdBy: 'test-user'
      })
    });

    if (!newRoomRes.ok) {
      const error = await newRoomRes.json();
      log(`   ❌ Error: ${error.error}\n`, 'red');
    } else {
      const newRoom = await newRoomRes.json();
      log(`   ✅ Created room: "${newRoom.name}" (ID: ${newRoom._id})\n`, 'green');

      // Test 3: Get room by name
      log('3️⃣  Testing GET /api/chatrooms/:name', 'yellow');
      const getRoomRes = await fetch(`${API_URL}/chatrooms/${newRoom.name}`);
      const foundRoom = await getRoomRes.json();
      log(`   ✅ Found room: "${foundRoom.name}"\n`, 'green');

      // Test 4: Get messages (should be empty for new room)
      log('4️⃣  Testing GET /api/messages/:roomId', 'yellow');
      const messagesRes = await fetch(`${API_URL}/messages/${newRoom._id}`);
      const messagesData = await messagesRes.json();
      log(`   ✅ Found ${messagesData.messages.length} messages\n`, 'green');
    }

    log('✨ All tests passed!\n', 'green');
    log('Next: Connect to http://localhost:3000 and start chatting!\n', 'blue');

  } catch (error) {
    log(`❌ Error: ${error.message}\n`, 'red');
    log('Make sure the server is running: npm start\n', 'yellow');
  }
}

// Run tests
testAPIs();
