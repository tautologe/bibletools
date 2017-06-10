import {ReferenceParser, _bookNames} from './domain/reference';
import {BibleTextRepo} from './domain/bibleText';
import {BibleModule} from './domain/bibleModule';
import {CrossReferenceRepo} from './domain/crossReference';
import {LocationFragment} from './util/fragmentQuery';
import {EventWorker} from './util/eventWorker';
import {JSONLoader} from './util/jsonLoader';
import {UserNotes} from './userNotes';
import {BibleTextRenderer} from './render';
import {StrongRepo} from './domain/strongs'

const crossReferenceRepo = new CrossReferenceRepo(JSONLoader);
const bibleTextRepo = new BibleTextRepo(JSONLoader);
const strongRepo = new StrongRepo(JSONLoader);

const getInputProcessor = (getUserInput, bibleTextRenderer) => {
    const getBibleTextForReference = ({raw, resolved}) => {
        return bibleTextRepo.getFromReference(BibleModule.LUT1912, resolved)
            .then((bibleText) => crossReferenceRepo.enrichBibleTextWithReferences(bibleText))
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

const bookNamesElement = window.document.getElementById('booknames');
const outputElement = window.document.getElementById('results');
const userInputElement = window.document.getElementById('user-input');
const eventWorker = EventWorker(window);
const userNotes = UserNotes(window.localStorage, userInputElement);

const locationFragment = new LocationFragment(window);
if (locationFragment.hasParameter('q')) {
    userInputElement.innerText = locationFragment.getParameter('q');
} else {
    userNotes.restore();
}
const bibleTextRenderer = BibleTextRenderer(window, outputElement);
const processUserInput = getInputProcessor(
    userNotes.get,
    bibleTextRenderer);

window.document.addEventListener('click', function (e) {
    if (e.target.classList.contains('strongReference')) {
        const strongDefinitionView = e.target.closest('.verseinfo').getElementsByClassName('strongDefinition')[0];
        strongRepo.getItem(e.target.dataset.strongkey).then((strongDefinition) => {
            return bibleTextRenderer.displayStrongDefinition(strongDefinition, strongDefinitionView);
        });
    }
}, false);

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
