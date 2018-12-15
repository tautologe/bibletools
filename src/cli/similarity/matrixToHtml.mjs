const header = `<meta charset="utf-8">
    <style>
    td.avg { background-color: #ddd}
    td[class^=val0\\.9]{ background-color: #0f0}
    td[class^=val0\\.8]{ background-color: #3f3}
    td[class^=val0\\.7]{ background-color: #cfc}
    td[class^=val0\\.2]{ background-color: #faa}
    td[class^=val0\\.1]{ background-color: #f33}
    td[class^=val0\\.0]{ background-color: #f00}
    </style>
    <a href="matrix_at.html">AT</a> - <a href="matrix_nt.html">NT</a>`;

const calculateAverage = (numbers) => (numbers.reduce((sum, next) => sum + parseFloat(next), 0)/numbers.length).toPrecision(2)

const displayAsTable = (matrix, columnNames) => {
    const tableHeader = '<th>' + (columnNames.concat(["Ø"])).map(columnName => `<td>${columnName}</td>`).join('') + '</th>';
    const tableRows = matrix.map((row, index) => {
        const entries = `<td>${columnNames[index]}</td>` + row.map((entry, index2) => `<td class="val${entry}"><a href="compareBooks.html#leftBook=${columnNames[index]}&rightBook=${columnNames[index2]}">${entry}</a></td>`).join('');
        const avgCell = `<td class="avg">${calculateAverage(row)}</td>`;
        return `<tr>${entries + avgCell}</tr>
        `;
    }).join('');
    return header + '<table>' + tableHeader + tableRows + '</table>';
};

export {
    displayAsTable
}

