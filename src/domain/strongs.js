// WORK IN PROGRESS

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



export {
    StrongDefinition, StrongDictionary
}
