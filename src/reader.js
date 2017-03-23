const loadJSON = (file) => new Promise(function(resolve, reject) {
    let req = new XMLHttpRequest();
    req.open('GET', file, true);
    req.onload = () => {
        if (req.status == "200") {
            resolve(JSON.parse(req.responseText));
        } else {
            reject(Error(req.statusText))
        }
    };
    req.send();
});

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

const getChapter = (path) => {
    return loadJSON(`bible/${path.join('/')}.json`);
};

const getVerseFromChapter = (versesRef, chapterJson) => {
    if (versesRef.to) {
        return chapterJson.verses.slice(versesRef.from.verse - 1, versesRef.to.verse - 1);
    } else {
        return chapterJson.verses.slice(versesRef.from.verse - 1, versesRef.from.verse);
    }
    
};

const getVerse = (reference) => {
    const path = getPath(reference);
    return getChapter(path).then((chapterJson) => getVerseFromChapter(reference.references[0], chapterJson));
};

export {
    getVerse
};
