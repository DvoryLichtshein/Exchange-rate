process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server');
const db = require('../db');

beforeAll(() => {
  db.prepare(`DELETE FROM exchange_rates`).run();
  db.prepare(`
    INSERT INTO exchange_rates (month, average_rate) VALUES
    ('2023-01', 3),
    ('2023-02', 6),
    ('2023-03', 9),
    ('2023-04', 12)
  `).run();
});

test('returns forecast, difference and product matrices', async () => {
  const res = await request(app).get('/api/forecast');

  expect(res.status).toBe(200);
  expect(res.body.forecastMatrix).toBeDefined();
  expect(res.body.differenceMatrix).toBeDefined();
  expect(res.body.productMatrix).toBeDefined();
});
