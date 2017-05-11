// imports seem to not work with babel atm, find out why
// import {ReferenceParser} from './domain/reference';
// import {BibleTextRepo} from './domain/bibleText';
// import {BibleModule} from './domain/bibleModule.js';

const getInputProcessor = (getUserInput, bibleTextRenderer) => {
    const ReferenceParser = window.reference.ReferenceParser;
    const BibleTextRepo = window.bibleText.BibleTextRepo;
    const BibleModule = window.bibleModule.BibleModule;

    const getBibleTextForReference = ({raw, resolved}) => {
        return BibleTextRepo.DEFAULT.getFromReference(BibleModule.LUT1912, resolved).then((bibleText) => {
            return bibleTextRenderer.renderBibleReferences(raw, bibleText);
        });
    };

    const detectBibleReferencesInUserInput = () => {
        const bibelReferences = ReferenceParser.DEFAULT.detectAndResolveBibleReferences(getUserInput());
        // TODO: get rid of this window reference
        window.document.getElementById("detected-json").innerHTML = JSON.stringify(bibelReferences, null, 2);
        return Promise.all(bibelReferences.map(getBibleTextForReference)).then(bibleTextRenderer.displayBibleVerses);
    };
    return detectBibleReferencesInUserInput;
};

export {
    getInputProcessor
};
