const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function testUserPasswords() {
  const conn = await mongoose.connect('mongodb://127.0.0.1:27017/udih_platform');
  const User = conn.model('User', new mongoose.Schema({
    email: String,
    password: String,
    role: String
  }));

  const admin = await User.findOne({ email: 'admin@udih.dev' });
  if (admin) {
    console.log('Admin found. Password hash:', admin.password);
    const match = await bcrypt.compare('Admin@UDIH2026!', admin.password);
    console.log('Admin password match with "Admin@UDIH2026!":', match);
  } else {
    console.log('Admin not found!');
  }

  const allUsers = await User.find({});
  console.log(`Total users in DB: ${allUsers.length}`);
  for (const u of allUsers) {
    console.log(`User: ${u.email}`);
  }

  await mongoose.disconnect();
}

testUserPasswords();
