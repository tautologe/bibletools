const UserNotes = function (storage, inputElement) {
    const STORAGE_KEY = 'userNotes';
    const _getUserInput = () => inputElement.innerText;
    return {
        get: _getUserInput,
        save: () => storage.setItem(STORAGE_KEY, _getUserInput()),
        restore: () => {
            const storageContent = storage.getItem(STORAGE_KEY);
            if (storageContent && storageContent.trim()) {
                inputElement.innerText = storageContent;
            }
        }
    }
};

export {
    UserNotes
};
