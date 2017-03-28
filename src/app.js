const getInputProcessor = (getUserInput, referenceDetector, getVerse, bibleTextRenderer) => {
    const getBibleTextForReference = ({raw, resolved}) => 
        getVerse(resolved).then((bibleText) => bibleTextRenderer.renderBibleReferences(raw, bibleText));

    const detectAndResolveBibleReferences = (inputText) => {
        const removeWhitespace = (reference) => reference.replace(/\s/g, '');
        const rawReferences = referenceDetector.detectReference(inputText);
        const resolveReference = (reference) => referenceDetector.resolveReference(removeWhitespace(reference));
        return rawReferences.map((reference) => ({ raw: reference, resolved: resolveReference(reference)}));
    };

    const detectBibleReferencesInUserInput = () => {
        const bibelReferences = detectAndResolveBibleReferences(getUserInput());
        return Promise.all(bibelReferences.map(getBibleTextForReference)).then(bibleTextRenderer.displayBibleVerses);
    };
    return detectBibleReferencesInUserInput;
};

export {
    getInputProcessor
};
