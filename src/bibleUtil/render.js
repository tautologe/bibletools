const BibleTextRenderer = function (outputElement) {
    const renderBibleReferences = (rawReference, nestedVerses) => {
        const uriEscapeReference = (reference) => encodeURIComponent(reference.replace(/\s/g, ''));
        const generateBibleServerLink = (reference) => `https://bibleserver.com/text/LUT/${uriEscapeReference(reference)}`;
        // TODO html escaping
        const referenceTemplate = (reference, bibleText) => `<p>${reference}:
            <small><a href="${generateBibleServerLink(reference)}" target="_blank">
                Öffne auf bibleserver.com
            </a></small></p><p>${bibleText}</p>`;
        const verseRangeToString = (verseRange) => verseRange.map((verse) => `<small>${verse.verse}</small> ${verse.text}`).join(' ');

        const flattenedVerses = [].concat(...nestedVerses);
        return referenceTemplate(rawReference, verseRangeToString(flattenedVerses));
    };
    const displayBibleVerses = (flattenedVerses) => outputElement.innerHTML = flattenedVerses.join('');
    
    return {renderBibleReferences, displayBibleVerses};
};

export {
    BibleTextRenderer
};
