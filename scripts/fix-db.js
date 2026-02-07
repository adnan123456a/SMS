#!/usr/bin/env node

/**
 * Fix MongoDB duplicate key error by dropping the old index
 * Run: node scripts/fix-db.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/chat-app';

async function fixDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected');

    // Drop the problematic indexes
    console.log('🔧 Dropping old indexes...');
    
    // Drop nid_1 index
    try {
      await mongoose.connection.collection('users').dropIndex('nid_1');
      console.log('✅ Dropped nid_1 index');
    } catch (err) {
      if (err.code === 27) {
        console.log('✅ Index nid_1 does not exist (already removed)');
      } else {
        console.log('⚠️ Could not drop nid_1 index:', err.message);
      }
    }

    // Drop drivingLicense_1 index
    try {
      await mongoose.connection.collection('users').dropIndex('drivingLicense_1');
      console.log('✅ Dropped drivingLicense_1 index');
    } catch (err) {
      if (err.code === 27) {
        console.log('✅ Index drivingLicense_1 does not exist (already removed)');
      } else {
        console.log('⚠️ Could not drop drivingLicense_1 index:', err.message);
      }
    }

    // Recreate indexes from schema
    console.log('🔄 Recreating indexes from schema...');
    const User = require('../models/User');
    await User.collection.getIndexes();
    console.log('✅ Indexes refreshed');

    console.log('\n✨ Database fixed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixDatabase();
