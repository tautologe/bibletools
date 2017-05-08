class Verse {
    constructor (book, chapter, verse, text) {
        this.text = text;
        this.book = book;
        this.chapter = chapter;
        this.verse = verse;
    }
}

class BibleText {
    constructor (reference, verses) {
        this.reference = reference;
        this.verses = verses;
    }
}

const BibleTextRepo = (function () {
    const loadJSON = (file) => new Promise(function(resolve, reject) {
        let req = new XMLHttpRequest();
        req.open('GET', file, true);
        req.onload = () => {
            if (req.status == '200') {
                resolve(JSON.parse(req.responseText));
            } else {
                reject(Error(req.statusText))
            }
        };
        req.send();
    });

    // TODO extract to module object, given as parameter
    const mapBook = (bookName) => {
        const bookMapping = {
            'Gen': '1Mo',
            'Jos': 'Jos',
            'Röm': 'Röm',
            'Offb': 'Offb',
            'Ex':'2Mo',
            'Lev':'3Mo',
            'Num':'4Mo',
            'Dtn':'5Mo',
            'Ri':'Ri',
            'Rut':'Rt',
            '1 Sam':'1Sam',
            '2 Sam':'2Sam',
            '1 Kön':'1Kö',
            '2 Kön':'2Kö',
            '1 Chr':'1Chr',
            '2 Chr':'2Chr',
            'Esra':'Esr', 
            'Neh':'Neh',
            'Tob':'Tob',
            'Jdt':'Jdt',
            'Est':'Est',
            '1 Makk':'1Makk',
            '2 Makk':'2Makk',
            'Ijob':'Hi',
            'Ps':'Ps',
            'Spr':'Spr',
            'Koh':'Pred',
            'Hld':'Hl',
            'Weish':'Weish',
            'Sir':'Sir',
            'Jes':'Jes',
            'Jer':'Jer',
            'Klgl':'Kla',
            'Bar':'Bar',
            'Ez':'Hes',
            'Dan':'Dan',
            'Hos':'Hos',
            'Joel':'Joe',
            'Am':'Am',
            'Obd':'Ob',
            'Jona':'Jon',
            'Mi':'Mi',
            'Nah':'Nah',
            'Hab':'Hab',
            'Zef':'Zeph',
            'Hag':'Hag',
            'Sach':'Sach',
            'Mal':'Mal',
            'Mt':'Mt',
            'Mk':'Mk',
            'Lk':'Lk',
            'Joh':'Joh',
            'Apg':'Apg',
            '1 Kor':'1Kor',
            '2 Kor':'2Kor',
            'Gal':'Gal',
            'Eph':'Eph',
            'Phil':'Phil',
            'Kol':'Kol',
            '1 Thess':'1Thes',
            '2 Thess':'2Thes',
            '1 Tim':'1Tim',
            '2 Tim':'2Tim',
            'Tit':'Tit',
            'Phlm':'Phim',
            'Hebr':'Hebr',
            'Jak':'Jak',
            '1 Petr':'1Petr',
            '2 Petr':'2Petr',
            '1 Joh':'1Jo',
            '2 Joh':'2Jo',
            '3 Joh':'3Jo',
            'Jud':'Jud'
        };
        return bookMapping[bookName];
    }

    const getPathArray = (reference) => {
        return [mapBook(reference.book), reference.from.chapter];
    };

    const getChapter = (path) => {
        return loadJSON(`bible/${path.join('/')}.json`);
    };

    const getVerseFromChapter = (reference, chapterJson) => {
        let verses;
        if (reference.to) {
            verses = chapterJson.verses.slice(reference.from.verse - 1, reference.to.verse);
        } else {
            verses = chapterJson.verses.slice(reference.from.verse - 1, reference.from.verse);
        }

        // TODO this format should be already in raw data
        return verses.map((verse) => {
            return new Verse(reference.book, reference.from.chapter, verse.verse, verse.text);
        });
    };

    const getVersesFromChapter = (references, chapterJson) => {
        const verses = references.map((reference) => getVerseFromChapter(reference, chapterJson));
        return new BibleText(references, verses);
    };
    
    return {
        // TODO use module object
        getFromReference: (module, references) => {
            // TODO maybe we need more than one chapter
            const path = getPathArray(references[0]);
            return getChapter(path).then((chapterJson) => getVersesFromChapter(references, chapterJson)).catch((err) => console.log(err));
        }
    };
} ());


export {
    BibleTextRepo 
};

