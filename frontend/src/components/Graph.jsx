import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyAverageChart = ({ data }) => {
  const labels = data.map(r => r.month);
  const values = data.map(r => r.average_rate);

  const min = Math.min(...values)- 0.05;
  const max = Math.max(...values)+ 0.05;

  // פונקציה לחישוב צבע לפי ערך
  const getColor = (value) => {
    if (max === min) return 'rgb(255,255,0)';
    const ratio = (value - min) / (max - min);
    const red = Math.round(255 * (1 - ratio));
    const green = Math.round(255 * ratio);
    return `rgb(${red}, ${green}, 0)`;
  };

  const chartData = {
    labels,
    datasets: [{
      label: 'Average Rate',
      data: values,
      borderColor: 'rgb(75, 192, 192)', // קו אחיד
      backgroundColor: 'rgba(0,0,0,0)', // רק הנקודות יצבעו
      pointBackgroundColor: values.map(getColor),
      pointBorderColor: values.map(getColor),
      pointRadius: 6,
      pointHoverRadius: 8,
      tension: 0.3, // קו חלק
    }]
  };

 const options = {
  responsive: true,
  maintainAspectRatio: false, // חשוב למנוע גלילה מיותרת
  plugins: {
    legend: { position: 'top' },
  },
  scales: {
    y: {
      min: min,
      max: max,
    }
  }
};


  return (
    <div style={{ width: '100%', height: '350px' }}> {/* גובה קבוע */}
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MonthlyAverageChart;
