/* global window, fetch, document */
import {getCommonComponents, dot_product} from '../domain/stats/similarity.mjs'
import {LocationFragment} from '../util/fragmentQuery.js';

const bookIndexAt = ["Gen","Ex","Lev","Num","Dtn","Jos","Ri","Rut","1 Sam","2 Sam","1 Kön","2 Kön","1 Chr","2 Chr","Esra","Neh","Est","Ijob","Ps","Spr","Koh","Hld","Jes","Jer","Klgl","Ez","Dan","Hos","Joel","Am","Obd","Jona","Mi","Nah","Hab","Zef","Hag","Sach","Mal"]
const bookIndexNt = ["Mt","Mk","Lk","Joh","Apg","Röm","1 Kor","2 Kor","Gal","Eph","Phil","Kol","1 Thess","2 Thess","1 Tim","2 Tim","Tit","Phlm","Hebr","Jak","1 Petr","2 Petr","1 Joh","2 Joh","3 Joh","Jud","Offb"]
const isAt = (bookName) => bookIndexAt.indexOf(bookName) > -1;
const isNt = (bookName) => bookIndexNt.indexOf(bookName) > -1;

const locationFragment = new LocationFragment(window);
window.onhashchange = () => {    
    loadParametersAndCompareBooks()
}

const loadParametersAndCompareBooks = () => {
    const book1 = getBookFromParameter('leftBook');
    const book2 = getBookFromParameter('rightBook');
    
    if (book1 && book2 && book1.testament === book2.testament) {
        showComparison(book1, book2);
    }
}


const getBookFromParameter = (parameterName) => {
    if (locationFragment.hasParameter(parameterName)) {
        const bookName = locationFragment.getParameter(parameterName);
        if (isAt(bookName)) {
            return {testament: 'at', name: bookName, index: bookIndexAt.indexOf(bookName)}
        }
        if (isNt(bookName)) {
            return {testament: 'nt', name: bookName, index: bookIndexNt.indexOf(bookName)}
        }
    }
}

const showComparison = (book1, book2) => {
    const strongVektorsFilename = '/data/strong_vektors_'+book1.testament+'.json';
    fetch(strongVektorsFilename).then(response => response.json()).then(bookVektors => {
        const bookSimilarity = dot_product(bookVektors[book1.index], bookVektors[book2.index]).toPrecision(2);

        const bookTitle = `${book1.name} verglichen mit ${book2.name}: ${bookSimilarity} (${(bookSimilarity * 100).toPrecision(2)}%) <br/>
        Liste der relevantesten gemeinsamen Begriffe (mit Strong-Referenz):`;

        document.getElementById('bookTitle').innerHTML = bookTitle;

        const strongPrefix = book1.testament === 'at' ? 'H' : 'G';

        const commonStrongComponents = getCommonComponents(bookVektors[book1.index], bookVektors[book2.index], strongPrefix).slice(0, 30);

        const fetchedStrongDetails = commonStrongComponents.map(strongComponent => {
            return fetch(`/data/repo/strong/${strongComponent.key}.json`)
                .then(response => response.json())
                .then(strongDetails => ({strongComponent, strongDetails}));
        });

        Promise.all(fetchedStrongDetails).then(allStrongDetails => {
            document.getElementById('strongs').innerHTML = "";
            return allStrongDetails.forEach(({strongComponent, strongDetails}) => {
                const germanTitle = strongDetails.occurrences[0].title.replace(/\([^)]*\)/, '').trim();
                const strongLine = `${strongComponent.key}: ${germanTitle} (${strongComponent.relevance.toPrecision(2)}) <br />`;
                document.getElementById('strongs').innerHTML += strongLine;
            });
        });
    });
}

loadParametersAndCompareBooks();

window.document.addEventListener('click', function (e) {
    if (e.target.classList.contains('bookPicker')) {
        const id = e.target.getAttribute("id");
        const [bookName, leftOrRight] = id.split("-");
        console.log([bookName, leftOrRight]);
        if (leftOrRight=='left') {
            locationFragment.setParameter('leftBook', bookName);
        } else {
            locationFragment.setParameter('rightBook', bookName);
        }
    
    }
}, false);
