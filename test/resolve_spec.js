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

    // not yet supported
    it.skip('should resolve multiple (more than two) verses', function () {
        assert.deepEqual(resolve('Gen1,3.6.9'), {
            book: 'Gen',
            references: [
                { from: { chapter: 1, verse: 3},to: undefined},
                { from: { chapter: 1, verse: 6},to: undefined},
                { from: { chapter: 1, verse: 9},to: undefined}
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
});