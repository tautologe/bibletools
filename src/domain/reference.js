class Reference {
    constructor (book, from, to) {
        this.book = book;
        this.from = from;
        this.to = to;
    }
}

const _bookNames = [
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
    ['Esra', 'Esr'],
    ['Neh', 'Nehemia'],
    ['Est', 'Ester', 'Esther'],
    ['Ijob','Hiob'],
    ['Ps','Psalm','Psalmen','Psalter'],
    ['Spr', 'Sprüche'],
    ['Koh','Kohelet','Prediger','Pred'],
    ['Hld', 'Hoheslied'],
    ['Jes', 'Jesaja'],
    ['Jer', 'Jeremia'],
    ['Klgl', 'Klagelieder', 'Klag'],
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
    ['Zef', 'Zefania', 'Zephania', 'Zeph'],
    ['Hag', 'Haggai'],
    ['Sach', 'Sacharja'],
    ['Mal', 'Maleachi'],
    ['Mt', 'Matthäus', 'Matt'],
    ['Mk', 'Markus', 'Mark'],
    ['Lk','Lukas', 'Luk'],
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
    ['Phlm', 'Philemon','Phim'],
    ['Hebr', 'Hebräer', 'Hebräerbrief'],
    ['Jak', 'Jakobus'],
    ['1 Petr', '1. Petrus'],
    ['2 Petr', '2. Petrus'],
    ['1 Joh', '1. Joh', '1. Johannes', '1. Brief des Johannes', '1. Johannesbrief'],
    ['2 Joh', '2. Joh', '2. Johannes', '2. Brief des Johannes', '2. Johannesbrief'],
    ['3 Joh', '3. Joh', '3. Johannes', '3. Brief des Johannes', '3. Johannesbrief'],
    ['Jud', 'Judas'],
    ['Offb', 'Offenbarung'],
    ['Jdt', 'Judit'],
    ['Weish', 'Weisheit'],
    ['Tob', 'Tobit'],
    ['Sir', 'Sirach', 'Jesus Sirach'],
    ['Bar', 'Baruch'],
    ['1 Makk', '1. Makkabäer'],
    ['2 Makk', '2. Makkabäer'],
];

class CitationStyle {
    constructor (language = 'de', chapterVerseDelimiter=',', rangeDelimiter='-', verseDelimiter='.') {
        this.language = language;
        this.chapterVerseDelimiter = chapterVerseDelimiter;
        this.rangeDelimiter = rangeDelimiter;
        this.verseDelimiter = verseDelimiter;
        this.bookNames = _bookNames;
    }
}

const flattenArray = (arrays) => [].concat.apply([], arrays);
const escapeForRegExp = (str) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
const removeWhitespace = (str) => str.replace(/\s/g, '');

class ReferenceParser {
    constructor (citationStyle) {
        const verseDelimiter = escapeForRegExp(citationStyle.verseDelimiter);

        const optionalFollowing = 'f?f?';
        // Negative-Look-Ahead-Group to avoid matching sth like Ps 2345 (without it would match 234 as a chapter)
        const numberOfMaximumThreeDigits = `\\d{1,3}(?!\\d)`;
        // Negative-Look-Behind to avoid matching booknames preceded by letters
        // TODO: Not supported by javascript
        // const noPrecedingLetters = `(?<![a-zA-Z])`;

        const createLinkRegexpString = (bookRegExpString, allowWhitespace, groupChaptersAndVerses) => {
            const optionalSpaces = allowWhitespace ? '\\s*' : '';
            // TODO: additional consistence check: maximum chapter number is (Psalm) 150.
            const chapter = groupChaptersAndVerses ? `(${numberOfMaximumThreeDigits})` : numberOfMaximumThreeDigits;
            // TODO: additional consistence check: maximum verse number is (Psalm 119),176.
            const verse = groupChaptersAndVerses ? `(${numberOfMaximumThreeDigits})` : numberOfMaximumThreeDigits;

            const optionalRange = `(${optionalSpaces}${citationStyle.rangeDelimiter}(${optionalSpaces}${chapter}${citationStyle.chapterVerseDelimiter})?${optionalSpaces}${verse})?`;
            const verseOrRange = `${verse}${optionalRange}${optionalFollowing}`;
            
            // optional: verses seperated by '.' like in Gen 1,2.4.6-8.10
            // detect unlimited number of verses
            const anyNumberOfVerses = `${verseOrRange}(${verseDelimiter}${verseOrRange})*`;
            // resolve up to three verses (explicit groups needed, so we cannot use *); 
            // extend this pattern to the needed number of resolved verses
            const upToThreeVerses = `${verseOrRange}(${verseDelimiter}${verseOrRange}(${verseDelimiter}${verseOrRange})?)?`;
            const oneOrMoreVerses = groupChaptersAndVerses ? upToThreeVerses : anyNumberOfVerses;
            return `${bookRegExpString}\\.?${optionalSpaces}${chapter}${optionalRange}(${citationStyle.chapterVerseDelimiter}${optionalSpaces}${oneOrMoreVerses})?`;
        };


        const createLinkDetectorRegexp = () => {
            const makeSpaceOptional = (str) => str.replace(' ', '\\s?');
            const bookRegExpString = `(${flattenArray(citationStyle.bookNames).map(escapeForRegExp).map(makeSpaceOptional).join('|')})`;
            const regexString = createLinkRegexpString(bookRegExpString, true, false);
            const re = new RegExp(regexString, 'g');
            return re;
        };
        const createLinkResolverRegexp = () => {
            const _escapeForRegExp = (str) => escapeForRegExp(str.replace(' ', ''));
            const bookRegExpString = `(${flattenArray(citationStyle.bookNames).map(_escapeForRegExp).join('|')})`;
            const regexString = createLinkRegexpString(bookRegExpString, false, true);
            const re = new RegExp(regexString);
            return re;
        };

        this.linkDetectorRegexp = createLinkDetectorRegexp();
        this.linkResolverRegexp = createLinkResolverRegexp();

        this.indexedBooknames = {};
        citationStyle.bookNames.forEach((book) => {
            book.forEach((bookname) => {
                this.indexedBooknames[bookname] = book[0];
                this.indexedBooknames[bookname.replace(' ', '')] = book[0];
            });
        });
    }

    detectReference (text) {
        return text.match(this.linkDetectorRegexp) || [];
    }

    resolveReference (rawReference) {
        const matches = this.linkResolverRegexp.exec(rawReference);
        const book = this.indexedBooknames[matches[1]];
        const chapter = parseInt(matches[2]);
        const verseFrom = parseInt(matches[8]);
        const chapterTo = parseInt(matches[11]) || chapter;
        const verseTo = parseInt(matches[12]);

        const from = {chapter, verse: verseFrom};
        const to = matches[12] && {chapter: chapterTo, verse: verseTo};

        const references = [new Reference(book, from, to)];
        if (matches[14]) {
            const from = {chapter, verse: parseInt(matches[14])};
            const to = matches[18] && {chapter, verse: parseInt(matches[18])};
            references.push(new Reference(book, from, to));
        }
        if (matches[20]) {
            const from = {chapter, verse: parseInt(matches[20])};
            const to = matches[24] && {chapter, verse: parseInt(matches[24])};
            references.push(new Reference(book, from, to));
        }
        return references;
    }

    detectAndResolveBibleReferences (text) {
        const rawReferences = this.detectReference(text);
        return rawReferences.map((rawReference) => ({ 
            raw: rawReference, 
            resolved: this.resolveReference(removeWhitespace(rawReference))
        }));
    }
}

CitationStyle.DEFAULT = new CitationStyle();

ReferenceParser.DEFAULT = new ReferenceParser(CitationStyle.DEFAULT);

export {
    Reference, ReferenceParser, _bookNames
}

