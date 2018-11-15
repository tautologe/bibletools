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

// create strong vektors with absolute occurrences
const strong_matrix_sparse = []
const strongPromise = fetch('repo/bible/strong_stats2.json').then(result => result.json())
strongPromise.then(json => json.forEach((book, book_index) => {
    strong_matrix_sparse[book_index] = []; 
    book.strongs.forEach(strong => {
        if (!stopWords.includes(strong.key)) {
            strong_matrix_sparse[book_index][strong.key.substring(1)] = strong.value
        }
    });
}));

// normalize strong vektors
const strong_normalized = strong_matrix_sparse.map(book => {
    const L2 = Math.sqrt(book.reduce((sum, next) => sum + (next*next), 0));
    return book.map(strong => {
        if (strong) {
            return strong/L2;
        }
    });
});


// Create similarity matrix of all bible books
strong_normalized.map(bookA => strong_normalized.map(bookB => dot_product(bookA, bookB).toPrecision(2)))


