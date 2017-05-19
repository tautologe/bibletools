// WORK IN PROGRESS

class StrongDefinition {
    constructor (key, title, transliteration, pronounciation, description, occurrences) {
        this.occurrences = occurrences;
    }
}

class StrongDictionary {
    constructor (language, definitions) {
        this.language = language;
        this.definitions = definitions;
    }
}

const strongsRepo = {
    getForVerse: (verse) => {
        return [{
            key: "H1234", title: "בּקע", transliteration: "bâqa‛", pronounciation: "baw-kah'", description: "brechen",
            occurrences: [
                {title: "aufbrachen", references: ["1;7;11"]}
            ]
        }, {
            key: "G1234", title: "διαγογγύζω", transliteration: "diagogguzō", pronounciation: "dee-ag-ong-good'-zo", description: "murren",
            occurrences: [
                {title: "murrten", references: ["42;15;2", "42;19;7"]}
            ]
        }];
    }
};


export {
    StrongDefinition, StrongDictionary, strongsRepo
}
