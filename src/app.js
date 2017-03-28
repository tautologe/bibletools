const start = (_window, eventWorker, UserNotes, referenceDetector, getVerse, BibleTextRenderer) => {
    const userInputElement = _window.document.getElementById('user-input');
    const outputElement = _window.document.getElementById('results');
    const bookNamesElement = _window.document.getElementById('booknames');
    const userNotes = UserNotes(_window.localStorage, userInputElement);
    const bibelTextRenderer = BibleTextRenderer(outputElement);

    const getBibleTextForReference = ({raw, resolved}) => 
        getVerse(resolved).then((bibleText) => bibelTextRenderer.renderBibleReferences(raw, bibleText));

    const detectAndResolveBibleReferences = (inputText) => {
        const removeWhitespace = (reference) => reference.replace(/\s/g, '');
        const rawReferences = referenceDetector.detectReference(inputText);
        const resolveReference = (reference) => referenceDetector.resolveReference(removeWhitespace(reference));
        return rawReferences.map((reference) => ({ raw: reference, resolved: resolveReference(reference)}));
    };

    const detectBibleReferencesInUserInput = () => {
        userNotes.save();
        const bibelReferences = detectAndResolveBibleReferences(userNotes.get());
        return Promise.all(bibelReferences.map(getBibleTextForReference)).then(bibelTextRenderer.displayBibleVerses);
    };

    userNotes.restore();
    detectBibleReferencesInUserInput();
    userInputElement.addEventListener("input", () => eventWorker.add(detectBibleReferencesInUserInput));
    bookNamesElement.innerHTML = referenceDetector._booknames.join(',');
};

export {
    start
};
