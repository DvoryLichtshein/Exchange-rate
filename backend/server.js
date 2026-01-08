const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const ratesRouter = require('./routes/rates');
const { fetchMonthRates } = require('./fetchTXT');
const { saveMonthlyAverage, calculateForecastMatrix, calculateDifferenceMatrix, calculateProductMatrix } = require('./monthProcessor');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/rates', ratesRouter);

app.get('/api/forecast', async (req, res) => {
    const rows = db.prepare(`SELECT month, average_rate FROM exchange_rates ORDER BY month ASC`).all();

    if (rows.length < 3) {
        return res.status(400).json({ error: "Not enough data to calculate forecast" });
    }

    const rates = rows.map(r => r.average_rate);
    const forecastMatrix = calculateForecastMatrix(rates);
    const differenceMatrix = calculateDifferenceMatrix(rates, forecastMatrix);
    const productMatrix = calculateProductMatrix(forecastMatrix, differenceMatrix);

    res.json({ forecastMatrix, differenceMatrix, productMatrix });
});

async function seedHistorical() {
    const startMonth = '2023-01';
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    let current = new Date(startMonth + '-01');

    const existingMonths = db.prepare(`SELECT month FROM exchange_rates`).all().map(r => r.month);

    while (current < end) {
        const monthStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
        if (!existingMonths.includes(monthStr)) {
            const hasData = await fetchMonthRates(monthStr);
            if (hasData) {
                saveMonthlyAverage(monthStr);
            }
        }
        current.setMonth(current.getMonth() + 1);
    }
}


if (process.env.NODE_ENV !== 'test') {

    seedHistorical()
        .then(() => console.log('Historical rates updated.'))
        .catch(err => console.error('Error in seedHistorical:', err));

    cron.schedule('0 0 1 * *', async () => {
        const today = new Date();
        today.setDate(1);
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
        const monthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
        await fetchMonthRates(monthStr);
        saveMonthlyAverage(monthStr);
    });

    const PORT = 3000;
    const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}



module.exports = app;
