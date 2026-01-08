const {
  calculateForecastMatrix,
  calculateDifferenceMatrix,
  calculateProductMatrix
} = require('../monthProcessor');

describe('monthProcessor calculations', () => {

  test('calculateForecastMatrix returns average of each 3-month window', () => {
    const rates = [3, 6, 9, 12];
    const result = calculateForecastMatrix(rates);
    expect(result).toEqual([
      (3 + 6 + 9) / 3,
      (6 + 9 + 12) / 3
    ]);
  });

  test('calculateDifferenceMatrix calculates actual - forecast', () => {
    const actual = [3, 6, 9, 12];
    const forecast = [(3 + 6 + 9) / 3, (6 + 9 + 12) / 3];
    const result = calculateDifferenceMatrix(actual, forecast);

    expect(result[0]).toBeCloseTo(9 - forecast[0]);
    expect(result[1]).toBeCloseTo(12 - forecast[1]);
  });

  test('calculateProductMatrix multiplies matrices element-wise', () => {
    const forecast = [5, 10];
    const diff = [2, -1];
    const result = calculateProductMatrix(forecast, diff);
    expect(result).toEqual([10, -10]);
  });

});
