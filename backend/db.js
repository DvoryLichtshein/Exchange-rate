const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, 'data');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'exchange_rates.db');
const db = new Database(dbPath);


db.prepare(`CREATE TABLE IF NOT EXISTS exchange_rates (
  month TEXT UNIQUE,
  average_rate REAL
)`).run();

module.exports = db;
