/* global XMLHttpRequest */
const cache = {};
const JSONLoader = {
    load: (file) => {
        if (cache[file]) {
            return cache[file];
        }
        const promise = new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.open('GET', '/data/repo/' + file, true);
            req.onload = () => {
                if (req.status == '200') {
                    resolve(JSON.parse(req.responseText));
                } else {
                    reject(Error(req.statusText))
                }
            };
            req.send();
        });
        cache[file] = promise;
        return promise;
    }
};

export {
    JSONLoader
};
