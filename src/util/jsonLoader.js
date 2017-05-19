const linklistCache = {};
const JSONLoader = {
    load: (file) => new Promise((resolve, reject) => {
        if (linklistCache[file]) {
            return resolve(JSON.parse(linklistCache[file]));
        }
        let req = new XMLHttpRequest();
        req.open('GET', file, true);
        req.onload = () => {
            if (req.status == '200') {
                linklistCache[file] = req.responseText;
                resolve(JSON.parse(req.responseText));
            } else {
                reject(Error(req.statusText))
            }
        };
        req.send();
    })
};

export {
    JSONLoader
};
