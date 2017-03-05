const _booknames = [
    ['Gen','Genesis','1. Mo','1 Mo','1. Mose', '1 Mose'],
    ['Ex','Exodus','2. Mo','2 Mo','2. Mose', '2 Mose'],
    ['Lev','Levitikus','3. Mo','3 Mo','3. Mose', '3 Mose'],
    ['Num','Numeri','4. Mo','4 Mo','4. Mose', '4 Mose'],
    ['Dtn','Deuteronomium','5. Mo','5 Mo','5. Mose', '5 Mose'],
    ['Jos', 'Josua'],
    ['Ri', 'Richter'],
    ['Rut', 'Ruth'],
    ['1 Sam', '1. Samuel', '1. Sam', '1 Samuel'],
    ['2 Sam', '2. Samuel', '2. Sam', '2 Samuel'],
    ['1 Kön', '1 Könige', '1. Könige', '1. Kön', '1 Kö', '1. Kö'],
    ['2 Kön', '2 Könige', '2. Könige', '2. Kön', '2 Kö', '2. Kö'],
    ['1 Chr', '1. Chronik', '1. Chr', '1 Chronik'],
    ['2 Chr', '2. Chronik', '2. Chr', '2 Chronik'],
    ['Esra'],
    ['Nehemia'],                        ['Tob', 'Tobit'],['Jdt', 'Judit'],
    ['Est', 'Ester', 'Esther'],         ['1 Makk', '1. Makkabäer'], ['2 Makk', '2. Makkabäer'],
    ['Ijob','Hiob'],
    ['Ps','Psalm','Psalmen','Psalter'],
    ['Spr', 'Sprüche'],
    ['Koh','Kohelet','Prediger','Pred'],
    ['Hld', 'Hoheslied'],           ['Weish', 'Weisheit'],['Sir', 'Sirach'],
    ['Jes', 'Jesaja'],
    ['Jer', 'Jeremia'],
    ['Klgl', 'Klagelieder'],        ['Bar', 'Baruch'],
    ['Ez','Ezechiel','Hes','Hesekiel'],
    ['Dan', 'Daniel'],
    ['Hos', 'Hosea'],
    ['Joel'],
    ['Am', 'Amos'],
    ['Obd', 'Obadja'],
    ['Jona'],
    ['Mi', 'Micha'],
    ['Nah', 'Nahum'],
    ['Hab', 'Habakuk'],
    ['Zef', 'Zefania'],
    ['Hag', 'Haggai'],
    ['Sach', 'Sacharja'],
    ['Mal', 'Maleachi'],
    ['Mt', 'Matthäus'],
    ['Mk', 'Markus'],
    ['Lk','Lukas'],
    ['Joh', 'Johannes'],
    ['Apg', 'Apostelgeschichte'],
    ['Röm', 'Römer', 'Rö'],
    ['1 Kor', '1. Kor', '1. Korinther', '1. Korintherbrief'],
    ['2 Kor', '2. Kor', '2. Korinther', '2. Korintherbrief'],
    ['Gal', 'Galater', 'Galaterbrief'],
    ['Eph', 'Epheser', 'Epheserbrief'],
    ['Phil', 'Philipper', 'Philipperbrief'],
    ['Kol','Kolosser', 'Kolosserbrief'],
    ['1 Thess', '1. Thess', '1. Thessalonicher'],
    ['2 Thess', '2. Thess', '2. Thessalonicher'],
    ['1 Tim', '1. Tim', '1. Timotheus'],
    ['2 Tim', '2. Tim', '2. Timotheus'],
    ['Tit', 'Titus'],
    ['Phlm', 'Philemon'],
    ['Hebr', 'Hebräer', 'Hebräerbrief'],
    ['Jak', 'Jakobus'],
    ['1 Petr', '1. Petrus'],
    ['2 Petr', '2. Petrus'],
    ['1 Joh', '1. Joh', '1. Johannes', '1. Brief des Johannes', '1. Johannesbrief'],
    ['2 Joh', '2. Joh', '2. Johannes', '2. Brief des Johannes', '2. Johannesbrief'],
    ['3 Joh', '3. Joh', '3. Johannes', '3. Brief des Johannes', '3. Johannesbrief'],
    ['Jud', 'Judas'],
    ['Offb', 'Offenbarung'],
];

const flattenArray = (arrays) => [].concat.apply([], arrays);

const regexFactory = (function () {
    const optionalFollowing = 'f?f?';
    // Negative-Look-Behind-Group to avoid matching sth like Ps 2345 (without it would match 234 as a chapter)
    const numberOfMaximumThreeDigits = `\\d{1,3}(?!\\d)`;

    const createLinkRegexpString = (bookRegExpString, allowWhitespace, groupChaptersAndVerses) => {
        const optionalSpaces = allowWhitespace ? '\\s*' : '';
        // TODO additional consistence check: maximum chapter number is (Psalm) 150.
        const chapter = groupChaptersAndVerses ? `(${numberOfMaximumThreeDigits})` : numberOfMaximumThreeDigits;
        // TODO additional consistence check: maximum verse number is (Psalm 119),176.
        const verse = groupChaptersAndVerses ? `(${numberOfMaximumThreeDigits})` : numberOfMaximumThreeDigits;

        const optionalRange = `(${optionalSpaces}-(${optionalSpaces}${chapter},)?${optionalSpaces}${verse})?`;
        const verseOrRange = `${verse}${optionalRange}${optionalFollowing}`;
        // optional: verses seperated by '.' like in Gen 1,2.4.6-8.10
        const oneOrMoreVerses = `${verseOrRange}(\\.${verseOrRange})*`;
        return `${bookRegExpString}\\.?${optionalSpaces}${chapter}${optionalRange}(,${optionalSpaces}${oneOrMoreVerses})?`;
    }


    return {
        createLinkDetectorRegexp: () => {
            const escapeForRegExp = (str) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            const bookRegExpString = `(${flattenArray(_booknames).map(escapeForRegExp).join('|')})`;
            const regexString = createLinkRegexpString(bookRegExpString, true, false);
            const re = new RegExp(regexString, 'ig');
            return re;
        },
        createLinkResolverRegexp: () => {
            const escapeForRegExp = (str) => str.replace(' ', '').replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            const bookRegExpString = `(${flattenArray(_booknames).map(escapeForRegExp).join('|')})`;
            const regexString = createLinkRegexpString(bookRegExpString, false, true);
            const re = new RegExp(regexString);
            return re;
        }
    }
})();


const linkDetectorRegexp = regexFactory.createLinkDetectorRegexp();
const linkResolverRegexp = regexFactory.createLinkResolverRegexp();

const detectReference = (text) => text.match(linkDetectorRegexp) || [];

const resolveReference = (rawReference) => {
    const matches = linkResolverRegexp.exec(rawReference);
    const chapter = parseInt(matches[2]);
    const verseFrom = parseInt(matches[8]);
    const chapterTo = parseInt(matches[11]) || chapter;
    const verseTo = parseInt(matches[12]);

    const from = {chapter, verse: verseFrom};
    const to = matches[12] && {chapter: chapterTo, verse: verseTo};

    const references = [{from, to}];
    if (matches[14]) {
        const from = {chapter, verse: parseInt(matches[14])};
        const to = matches[18] && {chapter, verse: parseInt(matches[18])};
        references.push({from, to});
    }

    return {
        book: matches[1],
        references
    };
};

export {
    detectReference,
    resolveReference,
    _booknames
}
