const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath);

const initDb = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Projects Table
      db.run(`
        CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          language TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Analyses Table
      db.run(`
        CREATE TABLE IF NOT EXISTS analyses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          project_id INTEGER,
          code_snippet TEXT NOT NULL,
          language TEXT NOT NULL,
          quality_score INTEGER,
          intent TEXT,
          summary TEXT,
          complexity_time TEXT,
          complexity_space TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id)
        )
      `);

      // Analysis Issues Table
      db.run(`
        CREATE TABLE IF NOT EXISTS analysis_issues (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          analysis_id INTEGER,
          title TEXT NOT NULL,
          severity TEXT NOT NULL,
          explanation TEXT,
          root_cause TEXT,
          suggested_fix TEXT,
          corrected_code TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (analysis_id) REFERENCES analyses(id)
        )
      `);

      // Reviews Table
      db.run(`
        CREATE TABLE IF NOT EXISTS reviews (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          project_id INTEGER,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'Open',
          score INTEGER,
          code_snippet TEXT NOT NULL,
          language TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id)
        )
      `);

      // Review Comments Table
      db.run(`
        CREATE TABLE IF NOT EXISTS review_comments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          review_id INTEGER,
          status TEXT DEFAULT 'Open',
          content TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (review_id) REFERENCES reviews(id)
        )
      `);

      // Project Intelligence Analyses Table
      db.run(`
        CREATE TABLE IF NOT EXISTS project_analyses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          project_id INTEGER,
          summary TEXT,
          architecture TEXT,
          quality_score INTEGER,
          languages TEXT,
          status TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id)
        )
      `);

      // Project Intelligence Files Table
      db.run(`
        CREATE TABLE IF NOT EXISTS project_analysis_files (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          pi_id INTEGER,
          path TEXT NOT NULL,
          language TEXT,
          size INTEGER,
          imports TEXT,
          exports TEXT,
          FOREIGN KEY (pi_id) REFERENCES project_analyses(id)
        )
      `, (err) => {
          if (err) return reject(err);
          // Try to add columns if they don't exist (ignore error if they do)
          db.run(`ALTER TABLE project_analysis_files ADD COLUMN imports TEXT`, () => {});
          db.run(`ALTER TABLE project_analysis_files ADD COLUMN exports TEXT`, () => {});
      });

      // Project Intelligence Issues Table
      db.run(`
        CREATE TABLE IF NOT EXISTS project_analysis_issues (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          pi_id INTEGER,
          title TEXT NOT NULL,
          severity TEXT NOT NULL,
          category TEXT,
          file_path TEXT,
          line_number TEXT,
          description TEXT,
          root_cause TEXT,
          impact TEXT,
          suggested_fix TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (pi_id) REFERENCES project_analyses(id)
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
};

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        console.error('Error running sql ' + sql);
        console.error(err);
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, result) => {
      if (err) {
        console.error('Error running sql: ' + sql);
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('Error running sql: ' + sql);
        console.error(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = {
  db,
  initDb,
  run,
  get,
  all
};
