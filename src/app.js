import {ReferenceParser, _bookNames} from './domain/reference';
import {BibleTextRepo} from './domain/bibleText';
import {BibleModule} from './domain/bibleModule';
import {CrossReferenceRepo} from './domain/crossReference';
import {LocationFragment} from './util/fragmentQuery';
const locationFragment = new LocationFragment(window);

const getInputProcessor = (getUserInput, bibleTextRenderer) => {
    const getBibleTextForReference = ({raw, resolved}) => {
        return BibleTextRepo.DEFAULT.getFromReference(BibleModule.LUT1912, resolved)
            .then((bibleText) => CrossReferenceRepo.DEFAULT.enrichBibleTextWithReferences(bibleText))
            .then((enrichedBibleText) => bibleTextRenderer.renderBibleReferences(raw, enrichedBibleText));
    };

    const detectBibleReferencesInUserInput = () => {
        const bibelReferences = ReferenceParser.DEFAULT.detectAndResolveBibleReferences(getUserInput());
        // TODO: get rid of this window reference
        window.document.getElementById("detected-json").innerHTML = JSON.stringify(bibelReferences, null, 2);
        return Promise.all(bibelReferences.map(getBibleTextForReference)).then(bibleTextRenderer.displayBibleVerses);
    };
    return detectBibleReferencesInUserInput;
};

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

import {EventWorker} from './util/eventWorker';
import {UserNotes} from './userNotes';
import {BibleTextRenderer} from './bibleUtil/render';

const bookNamesElement = window.document.getElementById('booknames');
const outputElement = window.document.getElementById('results');
const userInputElement = window.document.getElementById('user-input');
const eventWorker = EventWorker(window);
const userNotes = UserNotes(window.localStorage, userInputElement);


if (locationFragment.hasParameter('q')) {
    userInputElement.innerText = locationFragment.getParameter('q');
} else {
    userNotes.restore();
}
const processUserInput = getInputProcessor(
    userNotes.get,
    BibleTextRenderer(window, outputElement));

processUserInput();
const scheduleProcessing = () => eventWorker.add(() => {
    userNotes.save();
    return processUserInput();
});
userInputElement.addEventListener("input", scheduleProcessing);

locationFragment.addChangeListener((query) => {
    if (query['q']) {
        userInputElement.innerText = query['q'];
    } else {
        userNotes.restore();
    }
    scheduleProcessing();
});
bookNamesElement.innerHTML = _bookNames.join(',');

export {
    getInputProcessor
};
