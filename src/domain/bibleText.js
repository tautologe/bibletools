class Verse {
    constructor (book, chapter, verse, text) {
        this.text = text;
        this.book = book;
        this.chapter = chapter;
        this.verse = verse;
    }
}

class BibleText {
    constructor (references, verses) {
        this.references = references;
        this.verses = verses;
    }
}

const JSONLoader = {
    load: (file) => new Promise(function(resolve, reject) {
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
    })
};


class BibleTextRepo {
    constructor (JSONLoader) {
        this.JSONLoader = JSONLoader;
    }

    // todo make methods private
    _getPathArray (bookName, reference) {
        return [bookName, reference.from.chapter];
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
            return new Verse(reference.book, reference.from.chapter, verse.verse, verse.text);
        });
    }

    _getVersesFromChapter (references, chapterJson) {
        const verses = references.map((reference) => this._getVerseFromChapter(reference, chapterJson));
        return new BibleText(references, verses);
    }
    
    getFromReference (bibleModule, references) {
        // TODO maybe we need more than one chapter
        const path = this._getPathArray(bibleModule.mapBook(references[0].book), references[0]);
        return this._getChapter(path).then((chapterJson) => this._getVersesFromChapter(references, chapterJson)).catch((err) => console.log(err));
    }
}


export {
    Verse, BibleText, BibleTextRepo 
};

