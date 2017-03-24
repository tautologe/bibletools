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
        '1 Joh':'1Joh',
        '2 Joh':'2Joh',
        '3 Joh':'3Joh',
        'Jud':'Jud'
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
