const BibleTextRenderer = function (_window) {
    const sanitizeHTML = (unsafeString) => {
        var d = _window.document.createElement('div');
        d.appendChild(_window.document.createTextNode(unsafeString));
        return d.innerHTML;
    };
    const createStrongLinks = (text) => text.replace(/([GH][0-9]{1,4})/g, "<span class='strongReference' data-strongkey='$1'>$1</span>");

    const renderBibleReferences = (rawReference, bibleText) => {
        const uriEscapeReference = (reference) => encodeURIComponent(reference.replace(/\s/g, ''));
        const generateBibleServerLink = (reference) => `https://bibleserver.com/text/LUT/${uriEscapeReference(reference)}`;
        
        const referenceTemplate = (reference, bibleText) => `<p>${sanitizeHTML(reference)}:
            <small><a href="${generateBibleServerLink(reference)}" target="_blank">
                Öffne auf bibleserver.com
            </a></small></p>
            <p>${bibleText}</p>`;
        const strongReferencesToString = (strongReferences) => {
            if (!strongReferences || strongReferences.length == 0) {
                return '<span class="strongDefinition"></span>';
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
            const verseTemplate = (verse) => `<div class="bibleVerse">
                <small>${sanitizeHTML(verse.verse)}</small>
                ${createStrongLinks(sanitizeHTML(verse.text))}
                <div class="verseinfo">
                    ${crossReferencesToString(verse.crossReferences)}
                    ${strongReferencesToString(verse.strongReferences)}
                </div>
            </div>`;
            return verses.map((verse) => verseTemplate(verse)).join(' ');
        };
    
        return referenceTemplate(rawReference, verseRangeToString(bibleText.verses));
    };

    const displayStrongDefinition = (strongDefinition, strongView) => {
        strongView.innerHTML = `<h1>${sanitizeHTML(strongDefinition.key)}: ${sanitizeHTML(strongDefinition.title)}
        (${sanitizeHTML(strongDefinition.transliteration)})</h1>
        ${createStrongLinks(sanitizeHTML(strongDefinition.description))}
        <h2>In der Bibel übersetzt mit</h2>
        ${sanitizeHTML(strongDefinition.occurrences.map((occurrence) => occurrence.title.replace(/\([^)]*\)/, '').trim()).join(', '))}
        `;
    };
    
    return {renderBibleReferences, displayStrongDefinition};
};

export {
    BibleTextRenderer
};
