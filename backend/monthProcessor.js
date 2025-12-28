const db = require('./db.js');

/**
 * שמירת שער יומי
 * @param {string} dateStr - תאריך ב־YYYY-MM-DD
 * @param {number} rate - שער מטבע
 */
function saveDailyRate(dateStr, rate) {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS daily_rates (
            date TEXT PRIMARY KEY,
            rate REAL
        )
    `).run();

    db.prepare(`
        INSERT INTO daily_rates (date, rate)
        VALUES (?, ?)
        ON CONFLICT(date) DO UPDATE SET
            rate = excluded.rate
    `).run(dateStr, rate);
}

/**
 * חישוב ממוצע חודשי
 * @param {string} monthStr - חודש ב־YYYY-MM
 * @returns {number|null} ממוצע או null אם אין נתונים
 */
function calculateMonthlyAverage(monthStr) {
    const rows = db.prepare(`
        SELECT rate FROM daily_rates
        WHERE substr(date, 1, 7) = ?
    `).all(monthStr);

    if (!rows.length) return null;

    const sum = rows.reduce((acc, r) => acc + r.rate, 0);
    return sum / rows.length;
}

/**
 * עדכון או הוספת ממוצע חודשי
 * @param {string} monthStr
 */
function saveMonthlyAverage(monthStr) {
    const avg = calculateMonthlyAverage(monthStr);
    if (avg === null) {
        console.log(`[INFO] No daily rates for ${monthStr}`);
        return;
    }

    db.prepare(`
        CREATE TABLE IF NOT EXISTS exchange_rates (
            month TEXT PRIMARY KEY,
            average_rate REAL
        )
    `).run();

    db.prepare(`
        INSERT INTO exchange_rates (month, average_rate)
        VALUES (?, ?)
        ON CONFLICT(month) DO UPDATE SET
            average_rate = excluded.average_rate
    `).run(monthStr, avg.toFixed(3));

    console.log(`✅ Monthly avg saved for ${monthStr}: ${avg.toFixed(3)}`);
}

module.exports = {
    saveDailyRate,
    calculateMonthlyAverage,
    saveMonthlyAverage
};
