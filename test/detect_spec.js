import {detectReference as detect} from '../src/detect';
import assert from 'assert';

describe('link detector', function () {
    describe('should detect', function () {
        it('simple chapters', function () {
            assert.deepEqual(detect('Es steht in Gen 3 geschrieben'), ['Gen 3']);
            assert.deepEqual(detect('Es steht in Ex 12 geschrieben'), ['Ex 12']);
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

        describe('multiple verses', function () {
            it('seperated with points', function () {
                assert.deepEqual(detect('Es steht in Gen 3,12.14.16 geschrieben'), ['Gen 3,12.14.16']);
            });

            it('and ranges seperated with points', function () {
                assert.deepEqual(detect('Es steht in Gen 3,12.14-16.21 geschrieben'), ['Gen 3,12.14-16.21']);
            });

            it('spaces after dots will be interpreted as the end of the sentence', function () {
                assert.deepEqual(detect('Es steht in Gen 3,12. 14-16.21 geschrieben'), ['Gen 3,12']);
            });
        })
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

        it('left out spaces', function () {
            assert.deepEqual(detect('Es steht\n in 1.Kön 3,12 geschrieben'), ['1.Kön 3,12']);
        });
    });

    describe('should not detect', function () {
        it('numbers after spaces', function () {
            assert.deepEqual(detect('Es steht in 1. Mo. 6,9 12 geschrieben'), ['1. Mo. 6,9']);
        });

        it('chapters with more than three digits', function () {
            assert.deepEqual(detect('Es steht in Ps. 1234 geschrieben'), []);
        });

        it('verses with more than three digits', function () {
            assert.deepEqual(detect('Es steht in 1. Mo. 6,9121 geschrieben'), ['1. Mo. 6']);
        });

        it('booknames with small caps', function () {
            assert.deepEqual(detect('gen 1,1'), []);
        });

        it.skip('Booknames, being preceded by other letters', function () {
            // XxAm 4,12 could be interpreted as Am 4,12 (=Amos) otherwise
            // not supported yet as javascript does not support negative look behind groups
            assert.deepEqual(detect('XxAm 4,12'), []);
        });
    });
});


