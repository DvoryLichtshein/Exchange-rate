const RatesTable = ({ data, forecastData, showForecastMatrix }) => {
    const min = Math.min(...data.map(r => r.average_rate));
    const max = Math.max(...data.map(r => r.average_rate));

    const calculateDifference = (actualRate, forecastRate) => actualRate - forecastRate;

    const forecastMatrix = forecastData?.forecastMatrix || [];
    const differenceMatrix = forecastData?.differenceMatrix || [];
    const productMatrix = forecastData?.productMatrix || [];
    const differences = data.map((row, index) =>
        calculateDifference(row.average_rate, forecastMatrix[index] || 0)
    );

    const averageDifferences = differences.map((_, index) => {
        if (index < 2) return null;
        return (
            differences[index] +
            differences[index - 1] +
            differences[index - 2]
        ) / 3;
    });

    return (
        <table style={{
            borderCollapse: 'collapse', width: 'auto', minWidth: '380px'
        }}>
            <thead>
                <tr>
                    <th style={cellStyle}>Month</th>
                    <th style={cellStyle}>Actual Average</th>

                    {showForecastMatrix && (
                        <>
                            <th style={cellStyle}>Forecast</th>
                            <th style={cellStyle}>Difference</th>
                            <th style={cellStyle}>Multiplication</th>
                            <th style={cellStyle}>Avg Diff (3M)</th>
                        </>
                    )}
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr
                        key={row.month}
                        style={{
                            backgroundColor: index % 2 === 0 ? '#f1f1f1ff' : '#ffffff'
                        }}
                    >
                        <td style={cellStyle}>{row.month}</td>
                        <td style={{ ...cellStyle, backgroundColor: getColor(row.average_rate, min, max), color: '#000' }}>
                            {row.average_rate.toFixed(3)}
                        </td>

                        {showForecastMatrix && (
                            <>
                                <td style={cellStyle}>{forecastMatrix[index]?.toFixed(3) ?? '—'}</td>
                                <td style={cellStyle}>{differenceMatrix[index]?.toFixed(3) ?? '—'}</td>
                                <td style={cellStyle}>{productMatrix[index]?.toFixed(3) ?? '—'}</td>
                                <td style={cellStyle}>{averageDifferences[index] !== null ? averageDifferences[index].toFixed(3) : '—'}</td>
                            </>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const cellStyle = {
    border: '1px solid black',
    padding: '2px 5px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
};

function getColor(value, min, max) {
    if (max === min) return 'rgb(255,255,0)';
    const ratio = (value - min) / (max - min);
    const red = Math.round(255 * (1 - ratio));
    const green = Math.round(255 * ratio);
    return `rgb(${red}, ${green}, 0)`;
}

export default RatesTable;
