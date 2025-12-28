const RatesTable = ({ data, highlightMonth }) => {
    const min = Math.min(...data.map(r => r.average_rate));
    const max = Math.max(...data.map(r => r.average_rate));

    return (
        <table>
            <thead>
                <tr>
                    <th>Month</th>
                    <th>Average</th>
                </tr>
            </thead>
            <tbody>
                {data.map(r => (
                    <tr
                        key={r.month}
                        style={{
                            fontWeight: r.month === highlightMonth ? 'bold' : 'normal',
                            outline: r.month === highlightMonth ? '2px solid gold' : 'none'
                        }}
                    >
                        <td>{r.month}</td>
                        <td
                            style={{
                                backgroundColor: getColor(r.average_rate, min, max),
                                color: '#000'
                            }}
                        >
                            {r.average_rate}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default RatesTable;

function getColor(value, min, max) {
    if (max === min) return 'rgb(255,255,0)';
    const ratio = (value - min) / (max - min);
    const red = Math.round(255 * (1 - ratio));
    const green = Math.round(255 * ratio);
    return `rgb(${red}, ${green}, 0)`;
}
