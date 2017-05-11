const BibleTextRenderer = function (_window, outputElement, strongRepo) {
    const renderBibleReferences = (rawReference, bibleText) => {
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
            </a></small></p>
            <p>${bibleText}</p>`;
        const strongsToString = (strongDefinitions) => {
            return strongDefinitions.map((strongDefinition) => {
                return `<span title="${strongDefinition.title} (${strongDefinition.description})">${strongDefinition.key}</span>`;
            }).join(' ');
        };
        const verseRangeToString = (verses) => {
            const verseTemplate = (verse) => `
                <small>${sanitizeHTML(verse.verse)}</small>
                ${sanitizeHTML(verse.text)}
                <small>${strongsToString(strongRepo.getForVerse(verse))}</small>`;
            return verses.map((verse) => verseTemplate(verse)).join(' ');
        };
    
        return referenceTemplate(rawReference, verseRangeToString(bibleText.verses));
    };
    const displayBibleVerses = (flattenedVerses) => outputElement.innerHTML = flattenedVerses.join('');
    
    return {renderBibleReferences, displayBibleVerses};
};

export {
    BibleTextRenderer
};
