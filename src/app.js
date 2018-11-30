/* global window */
import {ReferenceParser} from './domain/reference.js';
import BibleTextRepo from './repo/BibleTextRepo.js';
import {BibleModule} from './domain/bibleModule.js';
import CrossReferenceRepo from './repo/CrossReferenceRepo.js';
import {LocationFragment} from './util/fragmentQuery.js';
import {EventWorker} from './util/eventWorker.js';
import {JSONLoader} from './util/jsonLoader.js';
import {UserNotes} from './userNotes.js';
import {BibleTextRenderer} from './render.js';
import StrongRepo from './repo/StrongRepo.js';
import {strongStatsTemplate} from './domain/strongStats.js';

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

const bibleTextRenderer = BibleTextRenderer(window);

const outputElement = window.document.getElementById('results');
const userInputElement = window.document.getElementById('user-input')

if (userInputElement && outputElement) {
    const eventWorker = EventWorker(window);
    const userNotes = UserNotes(window.localStorage, userInputElement);

    const locationFragment = new LocationFragment(window);
    if (locationFragment.hasParameter('q')) {
        userInputElement.innerText = locationFragment.getParameter('q');
    } else {
        userNotes.restore();
    }
    const processUserInput = getInputProcessor(
        userNotes.get,
        outputElement,
        bibleTextRenderer);

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

    window.document.addEventListener('click', function (e) {
        if (e.target.classList.contains('bibleReference')) {
            const reference = e.target.dataset.reference
            if (e.target.classList.contains('addToList')) {
                const q = userInputElement.innerText;
                userInputElement.innerText = `${q};${reference}`;
            } else {
                userInputElement.innerText = reference;
            }
            scheduleProcessing();
        }
    }, false);
}

const readBookStrongStats = () => {
    JSONLoader.load(`bible/strong_stats.json`).then((json) => {
        strongStatsTemplate(json, strongRepo).then((strongHtml) => {
            window.document.getElementById('booknames').innerHTML = strongHtml.join('');
        });
    });
};

if (window.readStrongStats) readBookStrongStats();


window.document.addEventListener('click', function (e) {
    if (e.target.classList.contains('strongReference')) {
        const strongDefinitionView = e.target.closest('.strongContainer').getElementsByClassName('strongDefinition')[0];
        strongRepo.getItem(e.target.dataset.strongkey).then((strongDefinition) => {
            return bibleTextRenderer.displayStrongDefinition(strongDefinition, strongDefinitionView);
        });
    }
}, false);

export {
    getInputProcessor
};
