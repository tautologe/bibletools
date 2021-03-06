/* global window, document */
import {LocationFragment} from '../util/fragmentQuery.js';
import StrongRepo from '../repo/StrongRepo.js';
import {JSONLoader} from '../util/jsonLoader.js';
import {BibleTextRenderer} from '../render.js';
import Chart from 'chart.js';

const bookIndexAt = ["Gen","Ex","Lev","Num","Dtn","Jos","Ri","Rut","1 Sam","2 Sam","1 Kön","2 Kön","1 Chr","2 Chr","Esra","Neh","Est","Ijob","Ps","Spr","Koh","Hld","Jes","Jer","Klgl","Ez","Dan","Hos","Joel","Am","Obd","Jona","Mi","Nah","Hab","Zef","Hag","Sach","Mal"]
const bookIndexNt = ["Mt","Mk","Lk","Joh","Apg","Röm","1 Kor","2 Kor","Gal","Eph","Phil","Kol","1 Thess","2 Thess","1 Tim","2 Tim","Tit","Phlm","Hebr","Jak","1 Petr","2 Petr","1 Joh","2 Joh","3 Joh","Jud","Offb"]

const locationFragment = new LocationFragment(window);
const bibleTextRenderer = BibleTextRenderer(window);
const strongRepo = new StrongRepo(JSONLoader);

const strongDefinitionContainer = document.getElementById('strongDefinitionContainer');
var ctx = document.getElementById("myChart").getContext("2d");

window.onhashchange = () => {
    showStrongInformation();
};

const showStrongInformation = () => {
    const strongParameter = 'strong';
    const strongKey = locationFragment.hasParameter(strongParameter) ? locationFragment.getParameter(strongParameter) : 'H1';
    const strongPrefix = strongKey.substring(0,1);

    strongRepo.getItem(strongKey).then((strongDefinition) => {
        bibleTextRenderer.displayStrongDefinition(strongDefinition, strongDefinitionContainer);

        strongRepo.getBookVektors(strongKey).then(([relevanceVektor, countVektor]) => {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: strongPrefix === 'H' ? bookIndexAt : bookIndexNt,
                    datasets: [{
                        label: `Relative Häufigkeit von ${strongDefinition.transliteration}`,
                        data: countVektor,
                        borderWidth: 1
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            });

            const output = relevanceVektor.map((strongRelevance, bookIndex) => {
                const bookNames = strongPrefix === 'H' ? bookIndexAt : bookIndexNt;
                const strongCount = countVektor[bookIndex];
                return [bookNames[bookIndex], strongCount, strongRelevance ? strongRelevance.toPrecision(2) : 0];
            });

            document.getElementById('strongStatsContainer').innerHTML = '';
            output.forEach(([bookName, count, relevance]) => {
                const html = `<span><b>${bookName}</b> absolut: ${count}; relativ: ${relevance}</span><br />`;
                document.getElementById('strongStatsContainer').innerHTML += html;
            });

            return output;
        });
    }).catch(err => {
        document.getElementById('strongDefinitionContainer').innerHTML = `No entry found for ${strongKey}. (${err})`;
    });
}

showStrongInformation();