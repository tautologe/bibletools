import { BibleText, Verse } from '../domain/bibleText';

const flattenArray = (arrays) => [].concat.apply([], arrays);

class BibleTextRepo {
    constructor (JSONLoader) {
        this.JSONLoader = JSONLoader;
    }

    // todo make methods private
    _getPathArray (bibleModule, reference) {
        return [bibleModule.moduleKey, bibleModule.mapBook(reference.book), reference.from.chapter];
    }

    _getChapter (path) {
        return this.JSONLoader.load(`bible/${path.join('/')}.json`);
    }

    _getVerseFromChapter (reference, chapterJson) {
        let verses;
        if (reference.to) {
            verses = chapterJson.verses.slice(reference.from.verse - 1, reference.to.verse);
        } else {
            verses = chapterJson.verses.slice(reference.from.verse - 1, reference.from.verse);
        }

        // TODO this format should be already in raw data
        return verses.map((verse) => {
            return new Verse(reference.book, reference.from.chapter, verse.verse, verse.text, [], verse.strongs);
        });
    }

    _getVersesFromChapter (references, chapterJson) {
        const verses = references.map((reference) => this._getVerseFromChapter(reference, chapterJson));
        return new BibleText(references, flattenArray(verses));
    }
    
    getFromReference (bibleModule, references) {
        // TODO maybe we need more than one chapter
        const path = this._getPathArray(bibleModule, references[0]);
        if (path[1] === -1) {
            // book not found in this bible module
            console.error(`book ${references[0].book} not found in ${bibleModule.moduleKey}`);
            return new Promise((resolve) => resolve(new BibleText(references, [])));
        }
        return this._getChapter(path).then((chapterJson) => this._getVersesFromChapter(references, chapterJson)).catch((err) => console.log(err, path, references));
    }
}

export default BibleTextRepo;