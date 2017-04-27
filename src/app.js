const getInputProcessor = (getUserInput, referenceDetector, getVerse, bibleTextRenderer) => {
    const getBibleTextForReference = ({raw, resolved}) => {
        return getVerse(resolved).then((bibleText) => {
            return bibleTextRenderer.renderBibleReferences(raw, bibleText);
        });
    };
        
    const removeWhitespace = (reference) => reference.replace(/\s/g, '');
    const detectReference = referenceDetector.detectReference;
    const resolveReference = (reference) => referenceDetector.resolveReference(removeWhitespace(reference));

    const detectAndResolveBibleReferences = (inputText) => {
        const rawReferences = detectReference(inputText);
        return rawReferences.map((reference) => ({ raw: reference, resolved: resolveReference(reference)}));
    };

    const detectBibleReferencesInUserInput = () => {
        const bibelReferences = detectAndResolveBibleReferences(getUserInput());
        // TODO: get rid of this window reference
        window.document.getElementById("detected-json").innerHTML = JSON.stringify(bibelReferences, null, 2);
        return Promise.all(bibelReferences.map(getBibleTextForReference)).then(bibleTextRenderer.displayBibleVerses);
    };
    return detectBibleReferencesInUserInput;
};

export {
    getInputProcessor
};
