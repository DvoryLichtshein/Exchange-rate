const express = require('express');
const router = express.Router();
const db = require('../db');

// כל החודשים – אפשרות מיון
router.get('/', (req, res) => {
  const { sortBy = 'month', order = 'asc' } = req.query;
  const column = sortBy === 'rate' ? 'average_rate' : 'month';
  const direction = order === 'desc' ? 'DESC' : 'ASC';

  const rows = db.prepare(
    `SELECT month, average_rate FROM exchange_rates ORDER BY ${column} ${direction}`
  ).all();

  res.json(rows);
});

// גרף – ממוצעים לפי חודש
router.get('/chart', (req, res) => {
  const rows = db.prepare(
    `SELECT month, average_rate FROM exchange_rates ORDER BY month ASC`
  ).all();
  res.json(rows);
});

// חיפוש חודש ספציפי
router.get('/search/:month', (req, res) => {
  const row = db.prepare(
    `SELECT month, average_rate FROM exchange_rates WHERE month = ?`
  ).get(req.params.month);

  res.json(row || null);
});

// חיזוי – ממוצע 3 חודשים אחרונים
router.get('/forecast', (req, res) => {
  const rows = db.prepare(
    `SELECT average_rate FROM exchange_rates ORDER BY month DESC LIMIT 3`
  ).all();

  if (rows.length < 3) return res.json(null);

  const avg =
    rows.reduce((s, r) => s + r.average_rate, 0) / 3;

  res.json({ forecast: Number(avg.toFixed(3)) });
});

module.exports = router;
