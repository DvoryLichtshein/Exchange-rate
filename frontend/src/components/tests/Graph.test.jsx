import { render } from '@testing-library/react';
import MonthlyAverageChart from '../Graph';

const data = [
  { month: '2023-01', average_rate: 3.2 },
  { month: '2023-02', average_rate: 3.6 },
];

test('renders chart without crashing', () => {
  const { container } = render(<MonthlyAverageChart data={data} />);
  expect(container).toBeTruthy();
});
