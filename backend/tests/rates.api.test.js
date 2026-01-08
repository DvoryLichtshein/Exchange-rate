const request = require('supertest');
const express = require('express');
const ratesRouter = require('../routes/rates');
const db = require('../db');

const app = express();
app.use(express.json());
app.use('/api/rates', ratesRouter);

beforeAll(() => {
  db.prepare(`DELETE FROM exchange_rates`).run();
  db.prepare(`
    INSERT INTO exchange_rates (month, average_rate)
    VALUES
    ('2023-01', 3.5),
    ('2023-02', 3.6),
    ('2023-03', 3.7)
  `).run();
});

describe('GET /api/rates', () => {

  test('returns rates sorted by month ASC', async () => {
    const res = await request(app).get('/api/rates');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
    expect(res.body[0].month).toBe('2023-01');
  });

  test('returns rates sorted by rate DESC', async () => {
    const res = await request(app).get('/api/rates?sortBy=rate&order=desc');
    expect(res.body[0].average_rate).toBe(3.7);
  });

});

describe('GET /api/rates/search/:month', () => {

  test('returns specific month', async () => {
    const res = await request(app).get('/api/rates/search/2023-02');
    expect(res.body.month).toBe('2023-02');
  });

  test('returns null if month not found', async () => {
    const res = await request(app).get('/api/rates/search/2024-01');
    expect(res.body).toBeNull();
  });

});

describe('GET /api/rates/forecast', () => {

  test('returns forecast based on last 3 months', async () => {
    const res = await request(app).get('/api/rates/forecast');
    expect(res.body.forecast).toBeCloseTo((3.5 + 3.6 + 3.7) / 3);
  });

});
