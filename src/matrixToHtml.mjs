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

// fs.writeFile("data/matrix_at.html", header + '<table>' + headerHtmlAt + rowsHtmlAt + '</table>', function(err) {
//     if(err) {
//         return console.log(err);
//     }
// });

// const headerHtmlNt = '<th>' + (bookIndexNt.concat(["Ø"])).map(bookName => `<td>${bookName}</td>`).join('') + '</th>';
// const rowsHtmlNt = similarity_matrix_nt.map((row, index) => {
//     const entries = `<td>${bookIndexNt[index]}</td>` + row.map(entry => `<td class="val${entry}">${entry}</td>`).join('');
//     const avg = (row.reduce((sum, next) => sum + parseFloat(next), 0)/row.length).toPrecision(2);
//     const avgCell = `<td class="avg val${avg}">${avg}</td>`;
//     return `<tr>${entries + avgCell}</tr>`
// }).join('');
// fs.writeFile("data/matrix_nt.html", header + '<table>' + headerHtmlNt + rowsHtmlNt + '</table>', function(err) {
//     if(err) {
//         return console.log(err);
//     }
// });

const displayAsTable = (matrix, columnNames) => {
    const tableHeader = '<th>' + (columnNames.concat(["Ø"])).map(bookName => `<td>${bookName}</td>`).join('') + '</th>';
    const tableRows = matrix.map((row, index) => {
        const entries = `<td>${columnNames[index]}</td>` + row.map(entry => `<td class="val${entry}">${entry}</td>`).join('');
        const avg = (row.reduce((sum, next) => sum + parseFloat(next), 0)/row.length).toPrecision(2);
        const avgCell = `<td class="avg val${avg}">${avg}</td>`;
        return `<tr>${entries + avgCell}</tr>`
    }).join('');
    return header + '<table>' + tableHeader + tableRows + '</table>';
};

export {
    displayAsTable
}

