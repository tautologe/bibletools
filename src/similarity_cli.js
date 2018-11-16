var fs = require('fs');

const bookIndexAt = ["Gen","Ex","Lev","Num","Dtn","Jos","Ri","Rut","1 Sam","2 Sam","1 Kön","2 Kön","1 Chr","2 Chr","Esra","Neh","Est","Ijob","Ps","Spr","Koh","Hld","Jes","Jer","Klgl","Ez","Dan","Hos","Joel","Am","Obd","Jona","Mi","Nah","Hab","Zef","Hag","Sach","Mal"]
const bookIndexNt = ["Mt","Mk","Lk","Joh","Apg","Röm","1 Kor","2 Kor","Gal","Eph","Phil","Kol","1 Thess","2 Thess","1 Tim","2 Tim","Tit","Phlm","Hebr","Jak","1 Petr","2 Petr","1 Joh","2 Joh","3 Joh","Jud","Offb"]

// helper function for creating the dot product
const dot_product = (vektor_a, vektor_b) => {
    return vektor_a.map((entry, index) => {
        if (vektor_b[index]) {
            return entry * vektor_b[index]
        } else {
            return 0;
        }
    }).reduce((sum, next) => sum + next, 0);
};

const stopWords = ["G2532","G846","G1519","G1151","G3756","G2192", "G1161",
"G1722", "G1063", "G3754", "G1909", "G2076", "G3004", "G2036", "G4314",
"G575", "G3956", "G2257", "G5216", "G2443", "G2228", "G4675", "G3588",
"G3739", "G5209", "G5213", "G5101", "G1096", "G1537", "G3326",
"H559", "H6440", "H2930", "H5922", "H6925"];
 
fs.readFile('demo/repo/bible/strong_stats2.json', 'utf8', function(err, contents) {

    const strong_matrix_sparse = []

    const json = JSON.parse(contents);

    json.forEach((book, book_index) => {
        strong_matrix_sparse[book_index] = []; 
        book.strongs.forEach(strong => {
            if (!stopWords.includes(strong.key)) {
                strong_matrix_sparse[book_index][strong.key.substring(1)] = strong.value
            }
        });
    });

    // normalize strong vektors
    const strong_normalized = strong_matrix_sparse.map(book => {
        const L2 = Math.sqrt(book.reduce((sum, next) => sum + (next*next), 0));
        return book.map(strong => {
            if (strong) {
                return strong/L2;
            }
        });
    });

    const strong_normalized_at = strong_normalized.slice(0,39);
    const strong_normalized_nt = strong_normalized.slice(39);


    // Create similarity matrix of all bible books
    const similarity_matrix_at = strong_normalized_at.map(bookA => strong_normalized_at.map(bookB => dot_product(bookA, bookB).toPrecision(2)));
    fs.writeFile("data/matrix_at.json", JSON.stringify(similarity_matrix_at, null, 2), function(err) {
        if(err) {
            return console.log(err);
        }
    });
    const similarity_matrix_nt = strong_normalized_nt.map(bookA => strong_normalized_nt.map(bookB => dot_product(bookA, bookB).toPrecision(2)))
    fs.writeFile("data/matrix_nt.json", JSON.stringify(similarity_matrix_nt, null, 2), function(err) {
        if(err) {
            return console.log(err);
        }
    });

    const headerHtmlAt = '<th>' + bookIndexAt.map(bookName => `<td>${bookName}</td>`).join('') + '</th>';
    const rowsHtmlAt = similarity_matrix_at.map((row, index) => {
        const entries = `<td>${bookIndexAt[index]}</td>` + row.map(entry => `<td>${entry}</td>`).join('')
        return `<tr>${entries}</tr>`
    }).join('');
    fs.writeFile("data/matrix_at.html", '<table>' + headerHtmlAt + rowsHtmlAt + '</table>', function(err) {
        if(err) {
            return console.log(err);
        }
    });

    const headerHtmlNt = '<th>' + bookIndexNt.map(bookName => `<td>${bookName}</td>`).join('') + '</th>';
    const rowsHtmlNt = similarity_matrix_nt.map((row, index) => {
        const entries = `<td>${bookIndexNt[index]}</td>` + row.map(entry => `<td>${entry}</td>`).join('')
        return `<tr>${entries}</tr>`
    }).join('');
    fs.writeFile("data/matrix_nt.html", '<table>' + headerHtmlNt + rowsHtmlNt + '</table>', function(err) {
        if(err) {
            return console.log(err);
        }
    });



});
 


