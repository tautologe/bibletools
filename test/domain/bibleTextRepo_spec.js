import assert from 'assert';
import {Verse, BibleText, BibleTextRepo} from '../../src/domain/bibleText';
import {BibleModule} from '../../src/domain/bibleModule';
import {Reference} from '../../src/domain/reference';

describe('bibleTextRepo', function () {
    const getJsonLoaderStub = (expectedInput, requiredOutput) => ({
        load: (path) => {
            assert.equal(path, expectedInput);
            return new Promise((resolve) => resolve(requiredOutput));
        }
    });
    const EXAMPLE_CHAPTER = {
        chapter: 1,
        verses: [
            { "verse": 1, "text": "Am Anfang schuf Gott Himmel und Erde."},
            { "verse": 2, "text": "Und die Erde war wüst und leer, und es war finster auf der Tiefe; und der Geist Gottes schwebte auf dem Wasser."}
        ]
    };

    const EXAMPLE_CHAPTER_WITH_STRONGS = {
        chapter: 1,
        verses: [
            { "verse": 1, "text": "Am Anfang schuf Gott Himmel und Erde.", strongs: ["H1234","H2345"]},
            { "verse": 2, "text": "Und die Erde war wüst und leer, und es war finster auf der Tiefe; und der Geist Gottes schwebte auf dem Wasser."}
        ]
    };

    it('should request the correct chapters', function () {
        const jsonLoaderStub = getJsonLoaderStub('bible/1Mo/1.json', EXAMPLE_CHAPTER);
        const exampleReference = new Reference('Gen', {chapter: 1, verse: 2});
        return new BibleTextRepo(jsonLoaderStub).getFromReference(BibleModule.LUT1912, [exampleReference])
        .then((bibleText) => {
            assert.deepEqual(bibleText, new BibleText([exampleReference], 
            [new Verse('Gen', 1, 2, "Und die Erde war wüst und leer, und es war finster auf der Tiefe; und der Geist Gottes schwebte auf dem Wasser.")]))
        });
    });

    it('should return the correct range', function () {
        const jsonLoaderStub = getJsonLoaderStub('bible/1Mo/1.json', EXAMPLE_CHAPTER);
        const exampleReference = new Reference('Gen', {chapter: 1, verse: 1}, {chapter: 1, verse: 2});
        return new BibleTextRepo(jsonLoaderStub).getFromReference(BibleModule.LUT1912, [exampleReference])
        .then((bibleText) => {
            assert.deepEqual(bibleText, new BibleText([exampleReference], [
                new Verse('Gen', 1, 1, EXAMPLE_CHAPTER.verses[0].text),
                new Verse('Gen', 1, 2, EXAMPLE_CHAPTER.verses[1].text)]))
        });
    });

    it('should return the correct verses for multiple references', function () {
        const jsonLoaderStub = getJsonLoaderStub('bible/1Mo/1.json', EXAMPLE_CHAPTER);
        const exampleReferences = [
            new Reference('Gen', {chapter: 1, verse: 1}),
            new Reference('Gen', {chapter: 1, verse: 2})
        ];
        return new BibleTextRepo(jsonLoaderStub).getFromReference(BibleModule.LUT1912, exampleReferences)
        .then((bibleText) => {
            assert.deepEqual(bibleText, new BibleText(exampleReferences, [
                new Verse('Gen', 1, 1, EXAMPLE_CHAPTER.verses[0].text),
                new Verse('Gen', 1, 2, EXAMPLE_CHAPTER.verses[1].text)]))
        });
    });

    it('should return the verse with Strong references', function () {
        const jsonLoaderStub = getJsonLoaderStub('bible/1Mo/1.json', EXAMPLE_CHAPTER_WITH_STRONGS);
        const exampleReferences = [
            new Reference('Gen', {chapter: 1, verse: 1}),
            new Reference('Gen', {chapter: 1, verse: 2})
        ];
        return new BibleTextRepo(jsonLoaderStub).getFromReference(BibleModule.LUT1912, exampleReferences)
        .then((bibleText) => {
            assert.deepEqual(bibleText, new BibleText(exampleReferences, [
                new Verse('Gen', 1, 1, EXAMPLE_CHAPTER.verses[0].text, [], ["H1234", "H2345"]),
                new Verse('Gen', 1, 2, EXAMPLE_CHAPTER.verses[1].text)]))
        });

    })
});
