import {BibleText} from '../domain/bibleText'
import {Reference} from '../domain/reference'
import {CrossReferences} from '../domain/crossReference'

const bookIndex = ["","Gen","Ex","Lev","Num","Dtn","Jos","Ri","Rut","1 Sam","2 Sam","1 Kön","2 Kön","1 Chr","2 Chr","Esra","Neh","Est","Ijob","Ps","Spr","Koh","Hld","Jes","Jer","Klgl","Ez","Dan","Hos","Joel","Am","Obd","Jona","Mi","Nah","Hab","Zef","Hag","Sach","Mal","Mt","Mk","Lk","Joh","Apg","Röm","1Kor","2Kor","Gal","Eph","Phil","Kol","1 Thess","2 Thess","1Tim","2Tim","Tit","Phlm","Hebr","Jak","1 Petr","2 Petr","1 Joh","2 Joh","3 Joh","Jud","Offb"]


const referenceToRefKey = (reference) => {
    const bookNumber = bookIndex.indexOf(reference.book);
    return `${bookNumber};${reference.from.chapter};${reference.from.verse}`
};

const refKeyToReference = (refKey) => {
    const refParts = refKey.split(';');
    const verses = refParts[2].split('-');
    const from = {chapter: refParts[1], verse: verses[0] > 0 ? verses[0] : null}
    const to = (verses[0] && verses[1] && {chapter: refParts[1], verse: verses[1]}) || null;
    return new Reference(bookIndex[refParts[0]], from, to);
}

class CrossReferenceRepo {
    constructor (jsonLoader) {
        this.jsonLoader = jsonLoader;
    }

    getOutgoingReferences (fromReference) {
        return this.jsonLoader.load('linklist.json')
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
            .then((crossReferences) => verse.withCrossReferences(crossReferences))
    }

    enrichBibleTextWithReferences (bibleText) {
        const promises = bibleText.verses.map((verse) => this.enrichVerseWithCrossReferences(verse));
        return Promise.all(promises).then((richVerses) => new BibleText(bibleText.references, richVerses));
    }
}

export default CrossReferenceRepo;