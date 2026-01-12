const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const isTest = process.env.NODE_ENV === 'test';

let dbPath;

if (isTest) {
  dbPath = ':memory:';
} else {
  const dbDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  dbPath = path.join(dbDir, 'exchange_rates.db');
}

const db = new Database(dbPath);

db.prepare(`
  CREATE TABLE IF NOT EXISTS daily_rates (
    date TEXT UNIQUE,
    rate REAL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS exchange_rates (
    month TEXT UNIQUE,
    average_rate REAL
  )
`).run();

module.exports = db;
