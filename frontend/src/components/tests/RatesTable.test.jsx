import { render, screen, within } from '@testing-library/react';
import RatesTable from '../RatesTable';


const mockRates = [
  { month: '2023-01', average_rate: 3.000 },
  { month: '2023-02', average_rate: 4.000 },
  { month: '2023-03', average_rate: 5.000 },
];

const mockForecast = [
  { month: '2023-01', forecast: 3.000, difference: 0.000, multiplication: 0.000 },
  { month: '2023-02', forecast: 3.500, difference: 2.000, multiplication: 2.000 },
  { month: '2023-03', forecast: 4.000, difference: 1.000, multiplication: 5.000 },
];

const tableData = [
  {
    month: '2023-01',
    actual: '3.000',
    forecast: '3.000',
    difference: '0.000',
    multiplication: '0.000',
  },
  {
    month: '2023-02',
    actual: '4.000',
    forecast: '3.500',
    difference: '2.000',
    multiplication: '2.000',
  },
  {
    month: '2023-03',
    actual: '5.000',
    forecast: '4.000',
    difference: '1.000',
    multiplication: '5.000',
  },
];

test('shows the correct forecast, difference and multiplication values', () => {
  render(<RatesTable data={mockRates} forecastData={mockForecast} />);

  tableData.forEach(({ month, actual }) => {
    const row = screen.getByText(month).closest('tr');
    const utils = within(row);

    expect(utils.getByText(Number(actual).toFixed(3))).toBeInTheDocument();
  });

});
