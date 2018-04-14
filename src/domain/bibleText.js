class Verse {
    constructor (book, chapter, verse, text, crossReferences = [], strongReferences = []) {
        this.text = text;
        this.book = book;
        this.chapter = chapter;
        this.verse = verse;
        this.crossReferences = crossReferences,
        this.strongReferences = Array.from(new Set(strongReferences))
    }

    withStrongReferences (strongReferences) {
        return new Verse(this.book, this.chapter, this.verse, this.text, [], strongReferences)
    }

    withCrossReferences (crossReferences) {
        return new Verse(this.book, this.chapter, this.verse, this.text, crossReferences, this.strongReferences)
    }
}

class BibleText {
    constructor (references, verses) {
        this.references = references;
        this.verses = verses;
    }
}

export {
    Verse, BibleText 
};

