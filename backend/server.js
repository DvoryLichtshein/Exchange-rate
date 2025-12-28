const express = require('express');
const cron = require('node-cron');
const ratesRouter = require('./routes/rates');
const { fetchMonthRates } = require('./fetchTXT');
const { saveMonthlyAverage } = require('./monthProcessor');

const app = express();
app.use(express.json());
app.use('/api/rates', ratesRouter);

// Seed ההיסטורי
async function seedHistorical() {
    const startMonth = '2023-01';
    const today = new Date();
    let current = new Date(startMonth + '-01');

    while (current <= today) {
        const monthStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2,'0')}`;
        await fetchMonthRates(monthStr);
        current.setMonth(current.getMonth() + 1);
    }
}

seedHistorical();

// Cron – חישוב ממוצע בסוף החודש עבור החודש האחרון
cron.schedule('0 0 1 * *', async () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
    const monthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2,'0')}`;
    saveMonthlyAverage(monthStr);
    console.log(`[CRON] Monthly average updated for ${monthStr}`);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
