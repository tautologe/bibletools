const createSparseMatrix = (strong_count_per_book, stopWords) => {
    const strong_matrix_sparse = [];
    strong_count_per_book.forEach((book, book_index) => {
        strong_matrix_sparse[book_index] = []; 
        book.strongs.forEach(strong => {
            if (!stopWords.includes(strong.key)) {
                strong_matrix_sparse[book_index][strong.key.substring(1)] = parseInt(strong.value)
            }
        });
    });
    return strong_matrix_sparse;
};

const normalizeVektor = (vektor) => {
    // norm vektor with the euclidean distance (L2)
    const L2 = Math.sqrt(vektor.reduce((sum, next) => sum + (next*next), 0));
    return vektor.map(strong => {
        if (strong) {
            return strong/L2;
        }
    });
};

const createVektors = (strong_count_per_book, stopWords) => {
    const strong_matrix_sparse = createSparseMatrix(strong_count_per_book, stopWords);

    // normalize strong vektors
    return strong_matrix_sparse.map(normalizeVektor);
};

export {
    createVektors, createSparseMatrix
};
