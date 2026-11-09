const mongoose = require('mongoose');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

async function search() {
  console.log('=== SEARCHING FOR USERS EVERYWHERE ===');

  // 1. Check all dbs in local MongoDB
  const conn = await mongoose.connect('mongodb://127.0.0.1:27017');
  const admin = conn.connection.db.admin();
  const dbs = await admin.listDatabases();
  for (const dbInfo of dbs.databases) {
    const db = conn.connection.useDb(dbInfo.name);
    const cols = await db.db.listCollections().toArray();
    for (const c of cols) {
      const docs = await db.db.collection(c.name).find({ $or: [
        { email: { $exists: true } },
        { user: { $exists: true } },
        { username: { $exists: true } }
      ] }).toArray();
      if (docs.length > 0) {
        console.log(`DB "${dbInfo.name}", Collection "${c.name}": ${docs.length} matching docs`);
        docs.forEach(d => console.log('  Doc:', d.email || d.name || d._id));
      }
    }
  }
  await mongoose.disconnect();

  // 2. Search all files in backend/ for any email patterns
  console.log('\nSearching text files for emails...');
  const files = ['backend/.env', 'backend/data/database.sqlite', 'backend/database.sqlite'];
  for (const f of files) {
    if (fs.existsSync(`D:/Capstone/Project-169/${f}`)) {
      console.log(`File exists: ${f} (${fs.statSync('D:/Capstone/Project-169/' + f).size} bytes)`);
    }
  }
}

search().catch(console.error);
