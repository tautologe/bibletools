import {Reference} from './reference';
import {RichVerse, BibleText} from './bibleText';


class CrossReferences {
    constructor(fromReference, toReferences) {
        this.fromReference = fromReference;
        this.toReferences = toReferences;
    }
}

const bookIndex = ["","Gen","Ex","Lev","Num","Dtn","Jos","Ri","Rut","1 Sam","2 Sam","1 Kön","2 Kön","1 Chr","2 Chr","Esra","Neh","Est","Ijob","Ps","Spr","Koh","Hld","Jes","Jer","Klgl","Ez","Dan","Hos","Joel","Am","Obd","Jona","Mi","Nah","Hab","Zef","Hag","Sach","Mal","Mt","Mk","Lk","Joh","Apg","Röm","1Kor","2Kor","Gal","Eph","Phil","Kol","1 Thess","2 Thess","1Tim","2Tim","Tit","Phlm","Hebr","Jak","1 Petr","2 Petr","1 Joh","2 Joh","3 Joh","Jud","Offb"]

// todo extract to util
const linklistCache = {};
const JSONLoader = {
    load: (file) => new Promise((resolve, reject) => {
        if (linklistCache.file) {
            return resolve(JSON.parse(linklistCache.file));
        }
        let req = new XMLHttpRequest();
        req.open('GET', file, true);
        req.onload = () => {
            if (req.status == '200') {
                linklistCache.file = req.responseText;
                resolve(JSON.parse(req.responseText));
            } else {
                reject(Error(req.statusText))
            }
        };
        req.send();
    })
};

const referenceToRefKey = (reference) => {
    const bookNumber = bookIndex.indexOf(reference.book);
    return `${bookNumber};${reference.from.chapter};${reference.from.verse}`
};

const refKeyToReference = (refKey) => {
    const refParts = refKey.split(';');
    const verses = refParts[2].split('-');
    const from = {chapter: refParts[1], verse: verses[0]}
    const to = verses[1] && {chapter: refParts[1], verse: verses[1]};
    return new Reference(bookIndex[refParts[0]], from, to);
}

class CrossReferenceRepo {
    constructor (jsonLoader) {
        this.jsonLoader = jsonLoader;
    }

    getOutgoingReferences (fromReference) {
        return this.jsonLoader.load('bible/linklist.json')
        .then((linklist) => linklist[referenceToRefKey(fromReference)])
        .then((referenceKeys) => {
            return referenceKeys && referenceKeys.map((refKey) => refKeyToReference(refKey))
        }).then((toReferences) => {
            if (toReferences) {
                return new CrossReferences(fromReference, toReferences);
            } else {
                return null;
            }
        });
    }

    enrichVerseWithCrossReferences (verse) {
        return this.getOutgoingReferences(new Reference(verse.book, { chapter: verse.chapter, verse: verse.verse }))
            .then((crossReferences) => new RichVerse(verse.book, verse.chapter, verse.verse, verse.text, crossReferences))
    }

    enrichBibleTextWithReferences (bibleText) {
        const promises = bibleText.verses.map((verse) => this.enrichVerseWithCrossReferences(verse));
        return Promise.all(promises).then((richVerses) => new BibleText(bibleText.references, richVerses));
    }
}

CrossReferenceRepo.DEFAULT = new CrossReferenceRepo(JSONLoader);
JSONLoader.load('bible/linklist.json')

export {
    CrossReferences, CrossReferenceRepo
}