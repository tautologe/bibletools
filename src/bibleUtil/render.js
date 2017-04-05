const BibleTextRenderer = function (_window, outputElement) {
    const renderBibleReferences = (rawReference, nestedVerses) => {
        const uriEscapeReference = (reference) => encodeURIComponent(reference.replace(/\s/g, ''));
        const generateBibleServerLink = (reference) => `https://bibleserver.com/text/LUT/${uriEscapeReference(reference)}`;
        const sanitizeHTML = (unsafeString) => {
            var d = _window.document.createElement('div');
            d.appendChild(_window.document.createTextNode(unsafeString));
            return d.innerHTML;
        }
        const referenceTemplate = (reference, bibleText) => `<p>${sanitizeHTML(reference)}:
            <small><a href="${generateBibleServerLink(reference)}" target="_blank">
                Öffne auf bibleserver.com
            </a></small></p><p>${bibleText}</p>`;
        const verseRangeToString = (verseRange) => {
            return verseRange.map((verse) => `<small>${sanitizeHTML(verse.verse)}</small> ${sanitizeHTML(verse.text)}`).join(' ');
        };

        const flattenedVerses = [].concat(...nestedVerses);        
        return referenceTemplate(rawReference, verseRangeToString(flattenedVerses));
    };
    const displayBibleVerses = (flattenedVerses) => outputElement.innerHTML = flattenedVerses.join('');
    
    return {renderBibleReferences, displayBibleVerses};
};

export {
    BibleTextRenderer
};
