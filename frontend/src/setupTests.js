import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    })
  );
});

jest.mock('./components/Graph', () => {
  return {
    __esModule: true,
    default: ({ data }) => <div data-testid="mock-chart" />,
  };
});
