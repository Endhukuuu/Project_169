const mongoose = require('mongoose');

async function showActivity() {
  const conn = await mongoose.connect('mongodb://127.0.0.1:27017/udih_platform');
  const logs = await conn.connection.db.collection('activitylogs').find({}).sort({ createdAt: -1 }).toArray();
  console.log(`Activity logs count: ${logs.length}`);
  logs.forEach(l => {
    console.log(`[${l.createdAt}] Action: ${l.action} | User: ${l.user} | IP: ${l.ipAddress || 'none'}`);
    console.log(`  Details:`, JSON.stringify(l.details));
  });
  await mongoose.disconnect();
}

showActivity();
