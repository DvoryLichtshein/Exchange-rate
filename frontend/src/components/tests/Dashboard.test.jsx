import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../Dashboard';


jest.mock('../Graph', () => () => (
  <div data-testid="mock-graph">Graph Mock</div>
));

global.fetch = jest.fn();

const mockRates = [
  { month: '2023-01', average_rate: 3.5 },
  { month: '2023-02', average_rate: 3.6 },
  { month: '2023-03', average_rate: 3.7 },
  { month: '2023-04', average_rate: 3.8 },
];

beforeEach(() => {
  fetch.mockImplementation((url) => {
    if (url.includes('/api/rates/forecast')) {
      return Promise.resolve({
        json: () => Promise.resolve({ forecast: 3.9 }),
      });
    }

    if (url.includes('/api/forecast')) {
      return Promise.resolve({
        json: () => Promise.resolve({}),
      });
    }

    if (url.includes('/api/rates')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockRates),
      });
    }
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders dashboard and loads rates', async () => {
  render(<Dashboard />);

  expect(await screen.findByText('Exchange Rates')).toBeInTheDocument();
  expect(await screen.findByText('2023-01')).toBeInTheDocument();
  expect(await screen.findByText('3.500')).toBeInTheDocument();
});

test('filters by search month', async () => {
  render(<Dashboard />);

  await screen.findByText('2023-01');

  fireEvent.change(screen.getByPlaceholderText('YYYY-MM'), {
    target: { value: '2023-03' },
  });

  expect(screen.getByText('2023-03')).toBeInTheDocument();
  expect(screen.queryByText('2023-01')).toBeNull();
});

test('toggles forecast matrix', async () => {
  render(<Dashboard />);

  await screen.findByText('2023-01');

  fireEvent.click(screen.getByText('Show Forecast Matrix'));

  expect(await screen.findByText('Forecast')).toBeInTheDocument();
  expect(screen.getByText('Difference')).toBeInTheDocument();
});

test('shows next month forecast', async () => {
  render(<Dashboard />);

  expect(await screen.findByText(/Forecast next month:/)).toHaveTextContent('3.9');
});
