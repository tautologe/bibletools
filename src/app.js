/* global window */
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

const getInputProcessor = (getUserInput, outputElement, bibleTextRenderer) => {
    const loadAndDisplayBibleText = (references) => {
        outputElement.innerHTML = "";
        const promises = references.map(({raw, resolved}) => {
            const textContainer = outputElement.ownerDocument.createElement("div");
            textContainer.setAttribute('class', 'referenceWithText');
            outputElement.appendChild(textContainer);
            return {raw, resolved, textContainer};
        }).map(({raw, resolved, textContainer}) => {
            const bibleTextPromise = bibleTextRepo.getFromReference(BibleModule.ELB1905, resolved)
                .then((bibleText) => crossReferenceRepo.enrichBibleTextWithReferences(bibleText))
                .then((enrichedBibleText) => bibleTextRenderer.renderBibleReferences(raw, enrichedBibleText));
            return {bibleTextPromise, textContainer};
        }).map(({bibleTextPromise, textContainer}) => {
            return bibleTextPromise.then((renderedBibletext) => {
                textContainer.innerHTML = renderedBibletext;
            });
        });
        return Promise.all(promises);
    };

    const detectBibleReferencesInUserInput = () => {
        const bibelReferences = ReferenceParser.DEFAULT.detectAndResolveBibleReferences(getUserInput());
        return loadAndDisplayBibleText(bibelReferences);
    };
    return detectBibleReferencesInUserInput;
};

const outputElement = window.document.getElementById('results');
const bookNamesElement = window.document.getElementById('booknames');
const userInputElement = window.document.getElementById('user-input');
const eventWorker = EventWorker(window);
const userNotes = UserNotes(window.localStorage, userInputElement);

const locationFragment = new LocationFragment(window);
if (locationFragment.hasParameter('q')) {
    userInputElement.innerText = locationFragment.getParameter('q');
} else {
    userNotes.restore();
}
const bibleTextRenderer = BibleTextRenderer(window);
const processUserInput = getInputProcessor(
    userNotes.get,
    outputElement,
    bibleTextRenderer);

window.document.addEventListener('click', function (e) {
    if (e.target.classList.contains('strongReference')) {
        const strongDefinitionView = e.target.closest('.bibleVerse').getElementsByClassName('strongDefinition')[0];
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
