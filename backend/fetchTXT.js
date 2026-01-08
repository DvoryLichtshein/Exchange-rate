const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { saveDailyRate } = require('./monthProcessor');
const db = require('./db.js');


async function fetchMonthRates(targetMonth) {
    db.prepare(`
        DELETE FROM daily_rates
        WHERE strftime('%Y-%m', date) = ?
    `).run(targetMonth);

    let rates = [];

    const [year, month] = targetMonth.split('-');

    const from = `${year}-${month}-01`;
    const to = `${year}-${month}-${new Date(year, month, 0).getDate()}`;
    const url = `https://www.boi.org.il/PublicApi/GetExchangeRates?fromDate=${from}&toDate=${to}&currency=USD`;

    try {

        const res = await axios.get(url);
        const json = res.data;

        if (json.exchangeRates && json.exchangeRates.length) {
            rates = json.exchangeRates
                .filter(r => r.key === 'USD')
                .map(r => ({
                    date: r.lastUpdate.split('T')[0],
                    rate: r.currentExchangeRate / (r.unit || 1)
                }));
        }
    } catch (err) {
        console.error('[FETCH] Failed for', targetMonth, err.message);
    }

    if (!rates.length) {
        const filePath = path.join(__dirname, 'data', 'boi_rates_2023_2025.txt');

        if (fs.existsSync(filePath)) {
            const text = fs.readFileSync(filePath, 'utf8');
            const lines = text.split('\n');

            lines.forEach(line => {
                const match = line.match(/(\d+\.\d+)\s+(\d{2})\/(\d{2})\/(\d{4})/);
                if (!match) {
                    return
                };

                const rate = parseFloat(match[1]);
                const lineDay = match[2].padStart(2, '0');
                const lineMonthPadded = match[3].padStart(2, '0');
                const lineYear = match[4];

                if (`${lineYear}-${lineMonthPadded}` === targetMonth) {
                    rates.push({
                        date: `${lineYear}-${lineMonthPadded}-${lineDay}`,
                        rate
                    });

                }
            });
        }
        if (!fs.existsSync(filePath))
            console.log('TXT file does not exist!');

    }


    if (!rates.length) {
        console.warn(`[FETCH] No rates found for ${targetMonth}, skipping monthly average`);
        return false;
    }

    rates.forEach(r => {
        saveDailyRate(r.date, r.rate);
    });

    return true;
}

module.exports = { fetchMonthRates };
