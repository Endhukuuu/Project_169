require('dotenv').config();
const mongoose = require('mongoose');

// Direct standard URI using the resolved shards
const directUri = "mongodb://endhukuunikuu_db_user:odezD40j7RYmwctQ@ac-hzkbbtv-shard-00-00.r8hvabb.mongodb.net:27017,ac-hzkbbtv-shard-00-01.r8hvabb.mongodb.net:27017,ac-hzkbbtv-shard-00-02.r8hvabb.mongodb.net:27017/udih_platform?ssl=true&replicaSet=atlas-hzkbbt-shard-0&authSource=admin&retryWrites=true&w=majority";

async function testDirect() {
  console.log('Connecting directly to Atlas shards...');
  try {
    const conn = await mongoose.connect(directUri, { serverSelectionTimeoutMS: 5000 });
    console.log('CONNECTED TO ATLAS! Host:', conn.connection.host);
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Atlas Collections:', collections.map(c => c.name));
    for (const c of collections) {
      const count = await conn.connection.db.collection(c.name).countDocuments();
      console.log(`- ${c.name}: ${count}`);
    }
    const users = await conn.connection.db.collection('users').find({}).toArray();
    console.log(`Users in Atlas (${users.length}):`);
    for (const u of users) {
      console.log(`- ${u.name} | ${u.email} | ${u.role} | ${u.status}`);
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('Direct connection failed:', err);
  }
}

testDirect();
