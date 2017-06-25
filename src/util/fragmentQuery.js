const _parseFragmentString = (fragmentString) => {
    if (fragmentString.lengh < 3) {
        return;
    }
    const paramStrings = fragmentString.substring(1).split('&')
    return paramStrings.reduce((result, paramString) => {
        if (paramString.indexOf('=') > 0) {
            const key = paramString.split('=')[0];
            const value = decodeURIComponent(paramString.split('=')[1]);
            result[key] = value;
        }
        return result;
    }, {});
};

const _createFragmentString = (query) => {
    return '#' + Object.keys(query).map((key) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
    }).join('&');
};

class LocationFragment {
    constructor (_window) {
        this._window = _window;
    }
    getParameter (key) {
        return this.getQuery() && this.getQuery()[key];
    }
    hasParameter (key) {
        return this.getParameter(key) && this.getParameter(key).length > 1;
    }
    setParameter (key, value) {
        const query = this.getQuery();
        query[key] = value;
        this.setQuery(query);
    }
    getQuery () {
        return _parseFragmentString(this._window.document.location.hash);
    }
    setQuery (query) {
        this._window.document.location.hash = _createFragmentString(query);
    }
    addChangeListener (callback) {
        this._window.addEventListener("hashchange", () => {
            callback(this.getQuery());
        }); 
    }
}

export {LocationFragment}