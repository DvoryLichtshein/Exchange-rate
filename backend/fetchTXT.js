const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { saveDailyRate } = require('./monthProcessor');

function isLastMonth(targetMonth) {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2,'0')}`;
    return targetMonth === currentMonth;
}

function isFinishedMonth(targetMonth) {
    const now = new Date();
    const [y, m] = targetMonth.split('-').map(Number);
    const firstDayNextMonth = new Date(y, m, 1);
    return now >= firstDayNextMonth;
}

async function fetchMonthRates(targetMonth) {
    if (!isFinishedMonth(targetMonth)) {
        console.log(`[SKIP] ${targetMonth} not finished yet`);
        return;
    }

    let rates = [];

    if (isLastMonth(targetMonth)) {
        const [year, month] = targetMonth.split('-');
        const from = `${year}-${month}-01`;
        const to = `${year}-${month}-${new Date(year, month, 0).getDate()}`;
        const url = `https://www.boi.org.il/PublicApi/GetExchangeRates?fromDate=${from}&toDate=${to}&currency=USD`;

        try {
            const res = await axios.get(url);
            const json = res.data;

            if (!json.exchangeRates || !json.exchangeRates.length) {
                console.error(`[FETCH] No exchange rates returned for ${targetMonth}`);
                return;
            }

            rates = json.exchangeRates
                .filter(r => r.key === 'USD')
                .map(r => r.currentExchangeRate / (r.unit || 1));

        } catch (err) {
            console.error(`[FETCH] Failed to fetch data for ${targetMonth}:`, err);
            return;
        }

    } else {
        const filePath = path.join(__dirname, 'data', 'boi_rates_2023_2025.txt');
        if (!fs.existsSync(filePath)) return;

        const text = fs.readFileSync(filePath, 'utf8');
        const lines = text.split('\n');

        lines.forEach(line => {
            const match = line.match(/(\d+\.\d+)\s+(\d{2})\/(\d{2})\/(\d{4})/);
            if (!match) return;
            const rate = parseFloat(match[1]);
            const month = match[3];
            const year = match[4];
            if (`${year}-${month}` === targetMonth) rates.push(rate);
        });
    }

    rates.forEach((rate, i) => {
        const day = String(i + 1).padStart(2, '0');
        saveDailyRate(`${targetMonth}-${day}`, rate);
    });

    console.log(`[FETCH] Saved ${rates.length} daily rates for ${targetMonth}`);
}

module.exports = { fetchMonthRates };
