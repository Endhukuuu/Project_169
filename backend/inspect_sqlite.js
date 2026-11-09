const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('D:/Capstone/Project-169/backend/database.sqlite');

db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
  if (err) {
    console.error('Error reading tables:', err);
    return;
  }
  console.log('Tables in database.sqlite:', tables.map(t => t.name));

  tables.forEach(table => {
    db.all(`SELECT * FROM ${table.name} LIMIT 10`, [], (err, rows) => {
      console.log(`\nTable ${table.name} (${rows ? rows.length : 0} rows):`);
      if (rows && rows.length > 0) {
        console.log(rows);
      }
    });
  });
});
