#!/usr/bin/env node

/**
 * Initialize MongoDB with sample data (optional)
 * Run: node scripts/init-db.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const ChatRoom = require('../models/ChatRoom');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/chat-app';

async function initDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional)
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await ChatRoom.deleteMany({});

    // Create sample users
    console.log('👥 Creating sample users...');
    const users = await User.insertMany([
      {
        username: 'alice',
        email: 'alice@example.com',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'
      },
      {
        username: 'bob',
        email: 'bob@example.com',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'
      },
      {
        username: 'charlie',
        email: 'charlie@example.com',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie'
      }
    ]);
    console.log(`✅ Created ${users.length} users`);

    // Create sample chat rooms
    console.log('💬 Creating sample chat rooms...');
    const rooms = await ChatRoom.insertMany([
      {
        name: 'general',
        description: 'General discussion and announcements',
        createdBy: users[0]._id
      },
      {
        name: 'random',
        description: 'Off-topic and random conversations',
        createdBy: users[1]._id
      },
      {
        name: 'tech',
        description: 'Technology and programming discussions',
        createdBy: users[2]._id
      },
      {
        name: 'memes',
        description: 'Share funny memes and jokes',
        createdBy: users[0]._id
      }
    ]);
    console.log(`✅ Created ${rooms.length} chat rooms`);

    console.log('\n✨ Database initialized successfully!');
    console.log('\nSample Credentials:');
    users.forEach(user => {
      console.log(`  - Username: ${user.username}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
