import detect from '../src/detect';
import assert from 'assert';

describe('link detector', function () {
    describe('should detect', function () {
        it('simple chapters', function () {
            assert.deepEqual(detect('Es steht in Gen 3 geschrieben'), ['Gen 3']);
        });

        it('simple chapters with verses', function () {
            assert.deepEqual(detect('Es steht in Gen 3,12 geschrieben'), ['Gen 3,12']);
        });

        it('simple chapters with verses and various spaces', function () {
            assert.deepEqual(detect('Es steht in Gen\t 3,  12 geschrieben'), ['Gen\t 3,  12']);
        });

        it('multiple links', function () {
            assert.deepEqual(detect('Es steht in Gen 3,12 und Gen 4,7 geschrieben'), ['Gen 3,12', 'Gen 4,7']);
        });

        it('should detect following annotation', function () {
            assert.deepEqual(detect('Es steht in Gen 3,12f geschrieben'), ['Gen 3,12f']);
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

            it('overlapping chapters with spaces', function () {
                assert.deepEqual(detect('Es steht in Gen 3, 12 - 4, 2 geschrieben'), ['Gen 3, 12 - 4, 2']);
            });
        });
    });

    describe('should support multiline strings', function () {
        it('one link on a line', function () {
            assert.deepEqual(detect('Es steht\n in Gen 3,12 geschrieben'), ['Gen 3,12']);
        });

        it('if reference is splitted by line break', function () {
            assert.deepEqual(detect('Es steht in Gen \n3,12 geschrieben'), ['Gen \n3,12']);
        });

        it('more than one link', function () {
            assert.deepEqual(detect('Es steht\n in Gen 3,12\n und Gen 4,3 geschrieben'), ['Gen 3,12', 'Gen 4,3']);
        });
    });

    describe('should support books with special characters', function () {
        it('like dots', function () {
            assert.deepEqual(detect('Es steht in 1. Mo. 6,9 geschrieben'), ['1. Mo. 6,9']);
            assert.deepEqual(detect('Es steht in 1 Mo. 6,9 geschrieben'), ['1 Mo. 6,9']);
        });

        it('umlaut', function () {
            assert.deepEqual(detect('Es steht\n in 1. Kön 3,12 geschrieben'), ['1. Kön 3,12']);
        });
    });
});


