import {ReferenceParser, _bookNames} from './domain/reference';
import {BibleTextRepo} from './domain/bibleText';
import {BibleModule} from './domain/bibleModule.js';

const getInputProcessor = (getUserInput, bibleTextRenderer) => {
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

//TODO: extract to module
const getFragmentQuery = () => {
    if (window.document.location.hash.length < 3) {
        return;
    }
    const paramStrings = window.document.location.hash.substring(1).split('&');
    return paramStrings.reduce((result, paramString) => {
        if (paramString.indexOf('=') > 0) {
            const key = paramString.split('=')[0];
            const value = decodeURIComponent(paramString.split('=')[1]);
            result[key] = value;
        }
        return result;
    }, {});
};

const hasFragmentQuery = () => getFragmentQuery() && getFragmentQuery()['q'] && getFragmentQuery()['q'].length > 1;

const restoreFromFragmentQuery = (inputElement) => {
    const fragmentQuery = getFragmentQuery();
    if (fragmentQuery && fragmentQuery['q'].length > 1) {
        inputElement.innerText = fragmentQuery['q'];
    }
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

        import {EventWorker} from './eventWorker';
        import {UserNotes} from './userNotes';
        import {BibleTextRenderer} from './bibleUtil/render'

        const bookNamesElement = window.document.getElementById('booknames');
        const outputElement = window.document.getElementById('results');
        const userInputElement = window.document.getElementById('user-input');
        const eventWorker = EventWorker(window);
        const userNotes = UserNotes(window.localStorage, userInputElement);
        if (hasFragmentQuery()) {
            restoreFromFragmentQuery(userInputElement);
        } else {
            userNotes.restore();
        }
        const processUserInput = getInputProcessor(
            userNotes.get,
            BibleTextRenderer(window, outputElement, strongsRepo));
        
        processUserInput();
        const scheduleProcessing = () => eventWorker.add(() => {
            userNotes.save();
            return processUserInput();
        });
        userInputElement.addEventListener("input", scheduleProcessing);
        
        window.addEventListener("hashchange", () => {
            if (hasFragmentQuery()) {
                restoreFromFragmentQuery(userInputElement);
            } else {
                userNotes.restore();
            }
            scheduleProcessing();
        }); 
        bookNamesElement.innerHTML = _bookNames.join(',');

export {
    getInputProcessor
};
