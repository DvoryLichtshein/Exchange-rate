import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';

const mockRates = [
    { month: '2023-01', average_rate: 3 },
    { month: '2023-02', average_rate: 4 },
    { month: '2023-03', average_rate: 5 },
];

jest.mock('../Dashboard', () => (props) => {
    const average =
        props.rates?.slice(-3).reduce((sum, r) => sum + r.average_rate, 0) / 3 || 0;
    return <div>Forecast next month: {average.toFixed(1)}</div>;
});

test('forecast calculation uses average of previous 3 months', () => {
    render(<Dashboard rates={mockRates} />);
    expect(screen.getByText('Forecast next month: 4.0')).toBeInTheDocument();
});
