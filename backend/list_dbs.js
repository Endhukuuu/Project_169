const mongoose = require('mongoose');

async function listDbs() {
  const conn = await mongoose.connect('mongodb://127.0.0.1:27017');
  const admin = conn.connection.db.admin();
  const dbs = await admin.listDatabases();
  console.log('Databases:', dbs);
  for (const dbInfo of dbs.databases) {
    const db = conn.connection.useDb(dbInfo.name);
    const cols = await db.db.listCollections().toArray();
    console.log(`Database "${dbInfo.name}" collections:`, cols.map(c => c.name));
    for (const c of cols) {
      const count = await db.db.collection(c.name).countDocuments();
      console.log(`  - ${c.name}: ${count} documents`);
    }
  }
  await mongoose.disconnect();
}

listDbs();
