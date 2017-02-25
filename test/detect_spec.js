import detect from '../src/detect';
import assert from 'assert';

describe('link detection', function () {
    it('should detect simple pattern', function () {
        assert.deepEqual(detect('Es steht in Gen 3,12 geschrieben'), ['Gen 3,12']);
    });

    it('should detect multiple links', function () {
        assert.deepEqual(detect('Es steht in Gen 3,12 und Gen 4,7 geschrieben'), ['Gen 3,12', 'Gen 4,7']);
    });

    it('should detect more links', function () {
        assert.deepEqual(detect('Es steht in 1. Mo. 6,9 geschrieben'), ['1. Mo. 6,9']);
        assert.deepEqual(detect('Es steht in 1 Mo. 6,9 geschrieben'), ['1 Mo. 6,9']);
    });
});


