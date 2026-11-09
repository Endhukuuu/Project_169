const { MongoClient } = require('mongodb');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = "mongodb+srv://endhukuunikuu_db_user:odezD40j7RYmwctQ@cluster0.r8hvabb.mongodb.net/?retryWrites=true&w=majority";

async function testMongo() {
  console.log('Testing MongoClient with detailed events...');
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000
  });

  client.on('serverDescriptionChanged', event => {
    console.log('Server Description Changed:', event.address, event.newDescription.error?.message || event.newDescription.type);
  });

  try {
    await client.connect();
    console.log('CLIENT CONNECTED!');
    const dbs = await client.db().admin().listDatabases();
    console.log('Databases in Atlas:', dbs);
    await client.close();
  } catch (err) {
    console.error('CLIENT ERROR:', err.message);
  }
}

testMongo();
