import {Reference, ReferenceParser} from '../../src/domain/reference';
import assert from 'assert';

const parser = ReferenceParser.DEFAULT;

describe('reference resolver', function () {
    it('should resolve simple verses', function () {
        assert.deepEqual(parser.resolveReference('Gen1,3'), [
            new Reference('Gen', { chapter: 1, verse: 3}, undefined)
        ]);
    });

    it('should resolve verse ranges', function () {
        assert.deepEqual(parser.resolveReference('Gen1,3-4'), [
            new Reference('Gen', { chapter: 1, verse: 3}, { chapter: 1, verse: 4})
        ]);
    });

    it('should resolve chapter overlapping ranges', function () {
        assert.deepEqual(parser.resolveReference('Gen1,3-2,4'), [
            new Reference('Gen', { chapter: 1, verse: 3}, { chapter: 2, verse: 4})
        ]);
    });

    it('should resolve multiple verses', function () {
        assert.deepEqual(parser.resolveReference('Gen1,3.6'), [
            new Reference('Gen', { chapter: 1, verse: 3}, undefined),
            new Reference('Gen', { chapter: 1, verse: 6}, undefined)
        ]);
    });

    it('should resolve multiple (more than two) verses', function () {
        assert.deepEqual(parser.resolveReference('Gen1,3-4.6-7.9-10'), [
            new Reference('Gen', { chapter: 1, verse: 3}, { chapter: 1, verse: 4}),
            new Reference('Gen', { chapter: 1, verse: 6}, { chapter: 1, verse: 7}),
            new Reference('Gen', { chapter: 1, verse: 9}, { chapter: 1, verse: 10})
        ]);
    });

    // not yet implemented, seems not to be supported by javascript http://stackoverflow.com/a/11959872
    // each group has to be explicit in the regular expression, so the number of detected groups is limited
    // a.t.m. we detect three verses
    it.skip('should resolve multiple (more than three) verses', function () {
        assert.deepEqual(parser.resolveReference('Gen1,3.6.9.12'), [
            new Reference('Gen', { chapter: 1, verse: 3}, undefined),
            new Reference('Gen', { chapter: 1, verse: 6}, undefined),
            new Reference('Gen', { chapter: 1, verse: 9}, undefined),
            new Reference('Gen', { chapter: 1, verse: 12}, undefined)
        ]);
    });

    it('should resolve multiple verse ranges', function () {
        assert.deepEqual(parser.resolveReference('Gen1,3-4.10-12'), [
            new Reference('Gen', { chapter: 1, verse: 3}, { chapter: 1, verse: 4}),
            new Reference('Gen', { chapter: 1, verse: 10}, { chapter: 1, verse: 12})
        ]);
    });

    it('should use canonical booknames', function () {
        assert.deepEqual(parser.resolveReference('Genesis1,3'), [
            new Reference('Gen', { chapter: 1, verse: 3}, undefined)
        ]);
    });

    it('should detect book names with numbers and dots', function () {
        assert.deepEqual(parser.resolveReference('1.Joh4,23'), [
            new Reference('1 Joh', { chapter: 4, verse: 23}, undefined)
        ]);
    });
});