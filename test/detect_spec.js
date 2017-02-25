import detect from '../src/detect';
import assert from 'assert';

describe('link detector', function () {
    describe('should detect', function () {
        it('should detect simple chapters', function () {
            assert.deepEqual(detect('Es steht in Gen 3 geschrieben'), ['Gen 3']);
        });

        it('should detect simple chapters with verses', function () {
            assert.deepEqual(detect('Es steht in Gen 3,12 geschrieben'), ['Gen 3,12']);
        });

        describe('ranges of', function () {
            it('verses', function () {
                assert.deepEqual(detect('Es steht in Gen 3,12-15 geschrieben'), ['Gen 3,12-15']);
            });

            it('chapters', function () {
                assert.deepEqual(detect('Es steht in Gen 3-5 geschrieben'), ['Gen 3-5']);
            });

            it('overlapping chapters', function () {
                assert.deepEqual(detect('Es steht in Gen 3,12-4,2 geschrieben'), ['Gen 3,12-4,2']);
            });
        });
    });
    
    it('should detect following annotation', function () {
        assert.deepEqual(detect('Es steht in Gen 3,12f geschrieben'), ['Gen 3,12f']);
    });

    it('should detect multiple links', function () {
        assert.deepEqual(detect('Es steht in Gen 3,12 und Gen 4,7 geschrieben'), ['Gen 3,12', 'Gen 4,7']);
    });

    it('should detect more links', function () {
        assert.deepEqual(detect('Es steht in 1. Mo. 6,9 geschrieben'), ['1. Mo. 6,9']);
        assert.deepEqual(detect('Es steht in 1 Mo. 6,9 geschrieben'), ['1 Mo. 6,9']);
    });
});


