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
                _window.console.error('catched error', err);
                reset();
            });
        }
    }

    _window.setInterval(doNext, 1000);
    
    return {
        add: (work) => next = work
    }
};

export {
    EventWorker
};
