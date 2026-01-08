const db = require('./db.js');

/**
 * @param {string} dateStr 
 * @param {number} rate 
 */
function saveDailyRate(dateStr, rate) {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS daily_rates (
            date TEXT PRIMARY KEY,
            rate REAL
        )
    `).run();

    const stmt = db.prepare(`INSERT OR REPLACE INTO daily_rates (date, rate) VALUES (?, ?)`);
    stmt.run(dateStr, rate);
}

/**
 * @param {string} monthStr 
 * @returns {number|null}
 */
function calculateMonthlyAverage(monthStr) {
    const rows = db.prepare(`
    SELECT rate FROM daily_rates
    WHERE strftime('%Y-%m', date) = ?
`).all(monthStr);


    if (!rows.length) return null;

    const sum = rows.reduce((acc, r) => acc + r.rate, 0);
    return sum / rows.length;
}

/**
 * @param {string} monthStr 
 */
function saveMonthlyAverage(monthStr) {
    db.prepare(`DELETE FROM exchange_rates WHERE month = ?`).run(monthStr);

    const avg = calculateMonthlyAverage(monthStr);
    if (avg === null) return;

    db.prepare(`
        INSERT INTO exchange_rates (month, average_rate)
        VALUES (?, ?)
    `).run(monthStr, avg);
}



function calculateForecastMatrix(rates) {
    let forecastMatrix = [];
    for (let i = 2; i < rates.length; i++) {
        const avgPrevThreeMonths =
            (rates[i - 2] + rates[i - 1] + rates[i]) / 3;
        forecastMatrix.push(avgPrevThreeMonths);
    }
    return forecastMatrix;
}


function calculateDifferenceMatrix(actualRates, forecastRates) {
    let differenceMatrix = [];
    for (let i = 0; i < forecastRates.length; i++) {
        differenceMatrix.push(actualRates[i + 2] - forecastRates[i]);
    }
    return differenceMatrix;
}


function calculateProductMatrix(forecastMatrix, differenceMatrix) {
    let productMatrix = [];
    for (let i = 0; i < forecastMatrix.length; i++) {
        productMatrix.push(forecastMatrix[i] * differenceMatrix[i]);
    }
    return productMatrix;
}

module.exports = {
    saveDailyRate,
    calculateMonthlyAverage,
    saveMonthlyAverage,
    calculateForecastMatrix,
    calculateDifferenceMatrix,
    calculateProductMatrix
};
