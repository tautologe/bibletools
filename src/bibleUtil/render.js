const BibleTextRenderer = function (_window, outputElement) {
    const sanitizeHTML = (unsafeString) => {
        var d = _window.document.createElement('div');
        d.appendChild(_window.document.createTextNode(unsafeString));
        return d.innerHTML;
    };

    const renderBibleReferences = (rawReference, bibleText) => {
        const uriEscapeReference = (reference) => encodeURIComponent(reference.replace(/\s/g, ''));
        const generateBibleServerLink = (reference) => `https://bibleserver.com/text/LUT/${uriEscapeReference(reference)}`;
        
        const referenceTemplate = (reference, bibleText) => `<div class="referenceWithText">
            <p>${sanitizeHTML(reference)}:
            <small><a href="${generateBibleServerLink(reference)}" target="_blank">
                Öffne auf bibleserver.com
            </a></small></p>
            <p>${bibleText}</p></div>`;
        const strongReferencesToString = (strongReferences) => {
            if (!strongReferences || strongReferences.length == 0) {
                return '';
            }
            return '<span class="strongReferences">[#] ' +
                strongReferences.map((strongReference) => {
                    return `<span class="strongReference" data-strongkey="${strongReference}">${strongReference}</span>`;
                }).join(' ') +
                '</span><span class="strongDefinition"></span>';
        };
        const crossReferencesToString = (crossReferences) => {
            if (!crossReferences || !crossReferences.fromReference) {
                return '';
            }
            return '<span class="crossReferences">[=&gt;] ' +
                    crossReferences.toReferences.map((ref) => `${ref.toString()}`).join('; ') +
                    '</span><br />';
        };
        const verseRangeToString = (verses) => {
            const verseTemplate = (verse) => `
                <small>${sanitizeHTML(verse.verse)}</small>
                ${sanitizeHTML(verse.text)}
                <div class="verseinfo">
                    ${crossReferencesToString(verse.crossReferences)}
                    ${strongReferencesToString(verse.strongReferences)}
                </div>`;
            return verses.map((verse) => verseTemplate(verse)).join(' ');
        };
    
        return referenceTemplate(rawReference, verseRangeToString(bibleText.verses));
    };
    const displayBibleVerses = (flattenedVerses) => outputElement.innerHTML = flattenedVerses.join('');

    const displayStrongDefinition = (strongDefinition, strongView) => {
        strongView.innerHTML = `<h1>${sanitizeHTML(strongDefinition.key)}: ${sanitizeHTML(strongDefinition.title)}
        (${sanitizeHTML(strongDefinition.transliteration)})</h1>
        ${sanitizeHTML(strongDefinition.description)}`;
    };
    
    return {renderBibleReferences, displayBibleVerses, displayStrongDefinition};
};

export {
    BibleTextRenderer
};
