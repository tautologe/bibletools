const loadJSON = (file, callback) => {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true);
    xobj.onreadystatechange = () => {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

const mapBook = (bookName) => {
    // TODO extend
    const bookMapping = {
        'Gen': '1Mo',
        'Jos': 'Jos',
        'Röm': 'Röm',
        'Offb': 'Offb'
    };
    return bookMapping[bookName];
}

const getPath = (reference) => {
    return [mapBook(reference.book), reference.references[0].from.chapter];
}

const getChapter = (path, callback) => {
    loadJSON(`bible/${path.join('/')}.json`, (response) => callback(JSON.parse(response)));
};

const getVerseFromChapter = (versesRef, chapterJson) => {
    if (versesRef.to) {
        return chapterJson.verses.slice(versesRef.from.verse - 1, versesRef.to.verse - 1);
    } else {
        return chapterJson.verses.slice(versesRef.from.verse - 1, versesRef.from.verse);
    }
    
};

const getVerse = (reference, callback) => {
    const path = getPath(reference);
    getChapter(path, (chapterJson) => {
        const verseRange = getVerseFromChapter(reference.references[0], chapterJson);
        callback(verseRange);
    });
};

export {
    getVerse
};
