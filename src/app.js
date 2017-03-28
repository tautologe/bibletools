const UserNotes = function (storage, inputElement) {
    const STORAGE_KEY = 'userNotes';
    const _getUserInput = () => inputElement.innerText;
    return {
        get: _getUserInput,
        save: () => storage.setItem(STORAGE_KEY, _getUserInput()),
        restore: () => {
            const storageContent = storage.getItem(STORAGE_KEY);
            if (storageContent.trim()) {
                inputElement.innerText = storageContent;
            }
        }
    }
};

const EventWorker = function (_window) {
    let pending = false;
    let next = null;
    let timer = 0;

    const reset = () => {
        if (timer > 0) {
            _window.console.log(`worker took ${Date.now() - timer}ms`);
        }
        next = null;
        pending = false;
    }

    const doNext = () => {
        if (next && !pending) {
            pending = true;
            timer = Date.now();
            next().then(() => {
                reset();
            }).catch((err) => {
                reset();
                _window.console.error('catched error', err);
            });
        }
    }

    _window.setInterval(doNext, 1000);
    
    return {
        add: (work) => next = work
    }
};


const start = (_window) => {
    const userInputElement = _window.document.getElementById('user-input');
    const outputElement = _window.document.getElementById('results');
    const bookNamesElement = _window.document.getElementById('booknames');
    const userNotes = UserNotes(_window.localStorage, userInputElement);
    const eventWorker = EventWorker(_window);
    const bibelTextRenderer = _window.render.BibleTextRenderer(outputElement);
    const detect = _window.detect;
    const reader = _window.reader;

    const getBibleTextForReference = ({raw, resolved}) => 
        reader.getVerse(resolved).then((bibleText) => bibelTextRenderer.renderBibleReferences(raw, bibleText));

    const detectAndResolveBibleReferences = (inputText) => {
        const removeWhitespace = (reference) => reference.replace(/\s/g, '');
        const rawReferences = detect.detectReference(inputText);
        const resolveReference = (reference) => detect.resolveReference(removeWhitespace(reference));
        return rawReferences.map((reference) => ({ raw: reference, resolved: resolveReference(reference)}));
    };

    const detectBibleReferencesInUserInput = () => {
        userNotes.save();
        const bibelReferences = detectAndResolveBibleReferences(userNotes.get());
        return Promise.all(bibelReferences.map(getBibleTextForReference)).then(bibelTextRenderer.displayBibleVerses);
    };

    userNotes.restore();
    detectBibleReferencesInUserInput();
    userInputElement.addEventListener("input", () => eventWorker.add(detectBibleReferencesInUserInput));
    bookNamesElement.innerHTML = detect._booknames.join(',');
};

export {
    start
};
