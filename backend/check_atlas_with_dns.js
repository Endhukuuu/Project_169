require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

async function testAtlas() {
  console.log('Testing Atlas connection with Google DNS...');
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    console.log('Atlas Connected successfully to:', conn.connection.host);
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Collections in Atlas:', collections.map(c => c.name));
    if (collections.some(c => c.name === 'users')) {
      const users = await conn.connection.db.collection('users').find({}).toArray();
      console.log(`Found ${users.length} users in Atlas:`);
      for (const u of users) {
        console.log(`- ${u.name} <${u.email}> (${u.role})`);
      }
    } else {
      console.log('No users collection in Atlas.');
    }
    await mongoose.disconnect();
  } catch (err) {
    console.log('Atlas connection error:', err.message);
  }
}

testAtlas();
