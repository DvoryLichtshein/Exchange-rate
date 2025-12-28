import React, { useEffect, useState } from 'react';
import MonthlyAverageChart from './Graph';
import RatesTable from './Table';
import './Dashboard.css';

const Dashboard = () => {
  const [rates, setRates] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [sortBy, setSortBy] = useState('months');
  const [searchMonth, setSearchMonth] = useState('');

  // fetch מהשרת
  useEffect(() => {
    fetch('http://localhost:3000/api/rates')
      .then(res => res.json())
      .then(setRates)
      .catch(err => console.error(err));

    fetch('http://localhost:3000/api/rates/forecast')
      .then(res => res.json())
      .then(data => setForecast(data?.forecast))
      .catch(err => console.error(err));
  }, []);

  // סינון ומיון לפי הבחירה והחיפוש
  const filteredData = rates
    .filter(r => r.month.includes(searchMonth))
    .sort((a, b) => {
      if (sortBy === 'months') {
        return new Date(a.month) - new Date(b.month);
      } else {
        return a.average_rate - b.average_rate;
      }
    });

  return (
    <div style={{ padding: 20 }}>
      <h1>Exchange Rates</h1>

      <div style={{ marginBottom: 10 }}>
        <label>
          Sort by:&nbsp;
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="months">Months</option>
            <option value="average">Average Rate (color)</option>
          </select>
        </label>

        &nbsp;&nbsp;&nbsp;

        <label>
          Search Month:&nbsp;
          <input
            type="text"
            placeholder="YYYY-MM"
            value={searchMonth}
            onChange={e => setSearchMonth(e.target.value)}
          />
        </label>
      </div>

      <div className="dashboard-container">
        <MonthlyAverageChart data={filteredData} />
        <RatesTable data={filteredData} highlightMonth={searchMonth} />
      </div>

      {forecast && <h3>Forecast next month: {forecast}</h3>}
    </div>
  );
};

export default Dashboard;
