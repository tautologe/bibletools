const dot_product = (vektor_a, vektor_b) => {
    return vektor_a.map((entry, index) => {
        if (vektor_b[index]) {
            return entry * vektor_b[index]
        } else {
            return 0;
        }
    }).reduce((sum, next) => sum + next, 0);
};

const createSimilarityMatrixFromVektors = (vektors, precision) => {
    if (precision) {
        return vektors.map(bookA => vektors.map(bookB => dot_product(bookA, bookB).toPrecision(2)));
    } else {
        return vektors.map(bookA => vektors.map(bookB => dot_product(bookA, bookB)));
    }
};

export {
    dot_product, createSimilarityMatrixFromVektors
}
