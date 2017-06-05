// WORK IN PROGRESS

import {Reference} from './reference';

class StrongDefinition {
    constructor (key, title, transliteration, pronounciation, description, occurrences) {
        this.key = key;
        this.title = title;
        this.transliteration = transliteration;
        this.pronounciation = pronounciation;
        this.description = description;
        this.occurrences = occurrences;
    }
}

class StrongDictionary {
    constructor (language, definitions) {
        this.language = language;
        this.definitions = definitions;
    }
}

//TODO duplicated from crossReferences => extract
const bookIndex = ["","Gen","Ex","Lev","Num","Dtn","Jos","Ri","Rut","1 Sam","2 Sam","1 Kön","2 Kön","1 Chr","2 Chr","Esra","Neh","Est","Ijob","Ps","Spr","Koh","Hld","Jes","Jer","Klgl","Ez","Dan","Hos","Joel","Am","Obd","Jona","Mi","Nah","Hab","Zef","Hag","Sach","Mal","Mt","Mk","Lk","Joh","Apg","Röm","1Kor","2Kor","Gal","Eph","Phil","Kol","1 Thess","2 Thess","1Tim","2Tim","Tit","Phlm","Hebr","Jak","1 Petr","2 Petr","1 Joh","2 Joh","3 Joh","Jud","Offb"]
const refKeyToReference = (refKey) => {
    const refParts = refKey.split(';');
    const verses = refParts[2].split('-');
    const from = {chapter: refParts[1], verse: verses[0] > 0 ? verses[0] : null}
    const to = (verses[0] && verses[1] && {chapter: refParts[1], verse: verses[1]}) || null;
    return new Reference(bookIndex[refParts[0]], from, to);
}

// const strongsRepo = {
//     getForVerse: (verse) => {
//         return [{
//             key: "H1234", title: "בּקע", transliteration: "bâqa‛", pronounciation: "baw-kah'", description: "brechen",
//             occurrences: [
//                 {title: "aufbrachen", references: ["1;7;11"]}
//             ]
//         }, {
//             key: "G1234", title: "διαγογγύζω", transliteration: "diagogguzō", pronounciation: "dee-ag-ong-good'-zo", description: "murren",
//             occurrences: [
//                 {title: "murrten", references: ["42;15;2", "42;19;7"]}
//             ]
//         }];
//     }
// };

class StrongRepo {
    constructor (JSONLoader) {
        this.JSONLoader = JSONLoader;
    }

    _getJson (key) {
        return this.JSONLoader.load(`strongs/${encodeURIComponent(key)}.json`);
    }

    getItem(key) {
        return this._getJson(key).then((jsonItem) => {
            return new StrongDefinition(
                jsonItem.id, 
                jsonItem.title_strongs, 
                jsonItem.transliteration, 
                '',
                jsonItem.englishDescription,
                jsonItem.occurrences.map((refKey) => refKeyToReference(refKey)));
        });
    }
}


export {
    StrongDefinition, StrongDictionary, StrongRepo
}
