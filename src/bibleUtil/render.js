const BibleTextRenderer = function (_window, outputElement) {
    const renderBibleReferences = (rawReference, bibleText) => {
        const uriEscapeReference = (reference) => encodeURIComponent(reference.replace(/\s/g, ''));
        const generateBibleServerLink = (reference) => `https://bibleserver.com/text/LUT/${uriEscapeReference(reference)}`;
        const sanitizeHTML = (unsafeString) => {
            var d = _window.document.createElement('div');
            d.appendChild(_window.document.createTextNode(unsafeString));
            return d.innerHTML;
        };
        const referenceTemplate = (reference, bibleText) => `<div class="referenceWithText">
            <p>${sanitizeHTML(reference)}:
            <small><a href="${generateBibleServerLink(reference)}" target="_blank">
                Öffne auf bibleserver.com
            </a></small></p>
            <p>${bibleText}</p></div>`;
        const strongsToString = (strongDefinitions) => {
            return strongDefinitions.map((strongDefinition) => {
                return `<span title="${strongDefinition.title} (${strongDefinition.description})">${strongDefinition.key}</span>`;
            }).join(' ');
        };
        const strongReferencesToString = (strongReferences) => {
            return strongReferences.map((strongReference) => {
                return `<span title="${strongReference}">${strongReference}</span>`;
            }).join(' ');
        };
        const crossReferencesToString = (crossReferences) => {
            if (!crossReferences || !crossReferences.fromReference) {
                return '';
            }
            return crossReferences.toReferences.map((ref) => `${ref.toString()}`).join('; ');
        };
        const verseRangeToString = (verses) => {
            const verseTemplate = (verse) => `
                <div class="verseinfo">
                    [${verse.verse}]
                    <span class="strongReferences">
                    ${strongReferencesToString(verse.strongReferences.sort())}
                    </span><br /><span class="crossReferences">
                    ${crossReferencesToString(verse.crossReferences)}
                    </span>
                </div>
                <small>${sanitizeHTML(verse.verse)}</small>
                ${sanitizeHTML(verse.text)}`;
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
