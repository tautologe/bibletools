const _createLinkDetectorRegexp = () => {
    const books = [
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
        ['Neh'],['Tob'],['Jdt'],
        ['Est'],['1 Makk'], ['2 Makk'],
        ['Ijob','Hiob'],
        ['Ps','Psalm','Psalmen','Psalter'],
        ['Spr', 'Sprüche'],
        ['Koh','Kohelet','Prediger','Pred'],
        ['Hld'],['Weish'],['Sir'],
        ['Jes', 'Jesaja'],
        ['Jer', 'Jeremia'],
        ['Klgl'],['Bar'],
        ['Ez','Ezechiel','Hes','Hesekiel'],
        ['Dan'],
        ['Hos'],
        ['Joel'],
        ['Am'],
        ['Obd'],
        ['Jona'],
        ['Mi'],
        ['Nah'],
        ['Hab'],
        ['Zef'],
        ['Hag'],
        ['Sach'],
        ['Mal'],
        ['Mt', 'Matthäus'],
        ['Mk', 'Markus'],
        ['Lk','Lukas'],
        ['Joh', 'Johannes'],
        ['Apg', 'Apostelgeschichte'],
        ['Röm', 'Römer'],
        ['1 Kor'],
        ['2 Kor'],
        ['Gal'],
        ['Eph'],
        ['Phil'],
        ['Kol','Kolosser'],
        ['1 Thess'],
        ['2 Thess'],
        ['1 Tim'],
        ['2 Tim'],
        ['Tit'],
        ['Phlm'],
        ['Hebr'],
        ['Jak'],
        ['1 Petr'],
        ['2 Petr'],
        ['1 Joh'],
        ['2 Joh'],
        ['3 Joh'],
        ['Jud'],
        ['Offb'],
    ];

    const flatten = (arrays) => [].concat.apply([], arrays);
    const escapeRegExp = (str) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");

    // regexp components
    const optionalSpaces = '\\s*';
    const bookRegExpString = `(${flatten(books).map(escapeRegExp).join('|')})`;
    const chapterWithOptionalVerse = `[0-9]{1,3}(,${optionalSpaces}[0-9]{1,3})?`;
    const optionalRange = `(${optionalSpaces}-${optionalSpaces}[0-9]{1,3}(,${optionalSpaces}[0-9]{1,3})?)?`;
    const optionaFollowing = 'f?f?';

    const re = new RegExp(`${bookRegExpString}\.?${optionalSpaces}${chapterWithOptionalVerse}${optionalRange}${optionaFollowing}`, 'g');
    return re;
};

const linkDetectorRegexp = _createLinkDetectorRegexp();

export default (text) => text.match(linkDetectorRegexp) || [];
