import fs from 'fs';
import {createVektors, createSparseMatrix} from './domain/stats/strongVektors';
import {createSimilarityMatrixFromVektors} from './domain/stats/similarity';
import {displayAsTable} from './matrixToHtml';

const bookIndexAt = ["Gen","Ex","Lev","Num","Dtn","Jos","Ri","Rut","1 Sam","2 Sam","1 Kön","2 Kön","1 Chr","2 Chr","Esra","Neh","Est","Ijob","Ps","Spr","Koh","Hld","Jes","Jer","Klgl","Ez","Dan","Hos","Joel","Am","Obd","Jona","Mi","Nah","Hab","Zef","Hag","Sach","Mal"]
const bookIndexNt = ["Mt","Mk","Lk","Joh","Apg","Röm","1 Kor","2 Kor","Gal","Eph","Phil","Kol","1 Thess","2 Thess","1 Tim","2 Tim","Tit","Phlm","Hebr","Jak","1 Petr","2 Petr","1 Joh","2 Joh","3 Joh","Jud","Offb"]

const writeToFileAsJson = (filename, content) => {
    const fileContent = JSON.stringify(content, null, 2);
    fs.writeFile(filename, fileContent, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log(`${fileContent.length} (chars) data written to ${filename}`);
    });
}

const writeToFile = (filename, content) => {
    fs.writeFile(filename, content, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log(`${content.length} (chars) data written to ${filename}`);
    });
}

const stopWords = ["G2532","G846","G1519","G1151","G3756","G2192", "G1161",
"G1722", "G1063", "G3754", "G1909", "G2076", "G3004", "G2036", "G4314",
"G575", "G3956", "G2257", "G5216", "G2443", "G2228", "G4675", "G3588",
"G3739", "G5209", "G5213", "G5101", "G1096", "G1537", "G3326",
"H559", "H6440", "H2930", "H5922", "H6925"];
 
fs.readFile('data/strong_count_per_book.json', 'utf8', function(err, contents) {
    const strong_counts_at = JSON.parse(contents).slice(0, 39);
    const strong_counts_nt = JSON.parse(contents).slice(39);

    const strongVektorsCount_at = createSparseMatrix(strong_counts_at, []);
    const strongVektorsCount_nt = createSparseMatrix(strong_counts_nt, []);
    writeToFileAsJson("data/strong_vektors_count_at.json", strongVektorsCount_at);
    writeToFileAsJson("data/strong_vektors_count_nt.json", strongVektorsCount_nt);

    const strong_normalized_at = createVektors(strong_counts_at, stopWords);
    const strong_normalized_nt = createVektors(strong_counts_nt, stopWords);

    writeToFileAsJson("data/strong_vektors_at.json", strong_normalized_at);
    writeToFileAsJson("data/strong_vektors_nt.json", strong_normalized_nt);

    const similarity_matrix_at = createSimilarityMatrixFromVektors(strong_normalized_at, 2);
    const similarity_matrix_nt = createSimilarityMatrixFromVektors(strong_normalized_nt, 2);

    writeToFileAsJson("data/matrix_at.json", similarity_matrix_at);
    writeToFileAsJson("data/matrix_nt.json", similarity_matrix_nt);

    writeToFile("data/matrix_at.html", displayAsTable(similarity_matrix_at, bookIndexAt));
    writeToFile("data/matrix_nt.html", displayAsTable(similarity_matrix_nt, bookIndexNt));
});
