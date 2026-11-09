require('dotenv').config();
const mongoose = require('mongoose');

async function inspect(uri, label) {
  console.log(`\n=== INSPECTING ${label} ===`);
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`Connected to: ${conn.connection.host}, DB: ${conn.connection.name}`);
    
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    if (collections.some(c => c.name === 'users')) {
      const users = await conn.connection.db.collection('users').find({}).toArray();
      console.log(`Found ${users.length} users:`);
      for (const u of users) {
        console.log(`- ID: ${u._id}`);
        console.log(`  Name: ${u.name}`);
        console.log(`  Email: "${u.email}" (length: ${u.email?.length})`);
        console.log(`  Role: ${u.role}`);
        console.log(`  Status: ${u.status}`);
        console.log(`  Password hash: ${u.password ? u.password.substring(0, 15) + '...' : 'NONE'}`);
        console.log(`  Created: ${u.createdAt}`);
      }
    } else {
      console.log('No "users" collection found.');
    }

    await mongoose.disconnect();
  } catch (err) {
    console.log(`Error inspecting ${label}:`, err.message);
  }
}

async function run() {
  // Check local first if mongod running
  await inspect('mongodb://127.0.0.1:27017/udih_platform', 'LOCAL MONGODB');
  // Check Atlas
  if (process.env.MONGODB_URI) {
    await inspect(process.env.MONGODB_URI, 'MONGODB ATLAS');
  }
}

run();
