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

// create strong vektors with absolute occurrences
const strong_matrix_sparse = []
const strongPromise = fetch('repo/bible/strong_stats2.json').then(result => result.json())
strongPromise.then(json => json.forEach((book, book_index) => {
    strong_matrix_sparse[book_index] = []; 
    book.strongs.forEach(strong => strong_matrix_sparse[book_index][strong.key.substring(1)] = strong.value);
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


