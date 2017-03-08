import {resolveReference as resolve} from '../src/detect';
import assert from 'assert';

describe('link resolver', function () {
    it('should resolve simple verses', function () {
        assert.deepEqual(resolve('Gen1,3'), {
            book: 'Gen',
            references: [
                { from: { chapter: 1, verse: 3}, to: undefined}
            ]
        });
    });

    it('should resolve verse ranges', function () {
        assert.deepEqual(resolve('Gen1,3-4'), {
            book: 'Gen',
            references: [
                { from: { chapter: 1, verse: 3},
                    to: { chapter: 1, verse: 4}}
            ]
        });
    });

    it('should resolve chapter overlapping ranges', function () {
        assert.deepEqual(resolve('Gen1,3-2,4'), {
            book: 'Gen',
            references: [
                { from: { chapter: 1, verse: 3},
                    to: { chapter: 2, verse: 4}}
            ]
        });
    });

    it('should resolve multiple verses', function () {
        assert.deepEqual(resolve('Gen1,3.6'), {
            book: 'Gen',
            references: [
                { from: { chapter: 1, verse: 3},to: undefined},
                { from: { chapter: 1, verse: 6},to: undefined}
            ]
        });
    });

    it('should resolve multiple (more than two) verses', function () {
        assert.deepEqual(resolve('Gen1,3-4.6-7.9-10'), {
            book: 'Gen',
            references: [
                { from: { chapter: 1, verse: 3},to: { chapter: 1, verse: 4}},
                { from: { chapter: 1, verse: 6},to: { chapter: 1, verse: 7}},
                { from: { chapter: 1, verse: 9},to: { chapter: 1, verse: 10}}
            ]
        });
    });

    // not yet implemented, seems not to be supported by javascript http://stackoverflow.com/a/11959872
    // each group has to be explicit in the regular expression, so the number of detected groups is limited
    // a.t.m. we detect three verses
    it.skip('should resolve multiple (more than three) verses', function () {
        assert.deepEqual(resolve('Gen1,3.6.9.12'), {
            book: 'Gen',
            references: [
                { from: { chapter: 1, verse: 3},to: undefined},
                { from: { chapter: 1, verse: 6},to: undefined},
                { from: { chapter: 1, verse: 9},to: undefined},
                { from: { chapter: 1, verse: 12},to: undefined}
            ]
        });
    });

    it('should resolve multiple verse ranges', function () {
        assert.deepEqual(resolve('Gen1,3-4.10-12'), {
            book: 'Gen',
            references: [
                { from: { chapter: 1, verse: 3},
                    to: { chapter: 1, verse: 4}},
                { from: { chapter: 1, verse: 10},
                    to: { chapter: 1, verse: 12}}
            ]
        });
    });

    it('should use canonical booknames', function () {
        assert.deepEqual(resolve('Genesis1,3'), {
            book: 'Gen',
            references: [
                { from: { chapter: 1, verse: 3}, to: undefined}
            ]
        });
    });
});