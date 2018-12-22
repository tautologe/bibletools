/* global document */
import StrongRepo from '../repo/StrongRepo.js';
import {JSONLoader} from '../util/jsonLoader.js';
import Chart from 'chart.js';

const strongRepo = new StrongRepo(JSONLoader);

const bookIndexAt = ["Gen","Ex","Lev","Num","Dtn","Jos","Ri","Rut","1 Sam","2 Sam","1 Kön","2 Kön","1 Chr","2 Chr","Esra","Neh","Est","Ijob","Ps","Spr","Koh","Hld","Jes","Jer","Klgl","Ez","Dan","Hos","Joel","Am","Obd","Jona","Mi","Nah","Hab","Zef","Hag","Sach","Mal"]
const bookIndexNt = ["Mt","Mk","Lk","Joh","Apg","Röm","1 Kor","2 Kor","Gal","Eph","Phil","Kol","1 Thess","2 Thess","1 Tim","2 Tim","Tit","Phlm","Hebr","Jak","1 Petr","2 Petr","1 Joh","2 Joh","3 Joh","Jud","Offb"]

const strongInputElement1 = document.getElementById("strongInput1")
const strongInputElement2 = document.getElementById("strongInput2")

const compareInputStrongs = () => {
    compareStrongs(strongInputElement1.value, strongInputElement2.value);
};

strongInputElement1.addEventListener("input", compareInputStrongs);
strongInputElement2.addEventListener("input", compareInputStrongs);

const getStrongPrefix = strongKey => strongKey.substring(0,1);

const ctx = document.getElementById("strongCompareChart").getContext("2d");
let chart = new Chart(ctx);
const chartOptions = {
    maintainAspectRatio: false,
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero:true
            }
        }]
    }
};

const compareStrongs = (strong1, strong2) => {
    const strongPrefix = getStrongPrefix(strong1);
    if (getStrongPrefix(strong1) != getStrongPrefix(strong2)) {
        console.error("you cannot compare greek and hebrew strong items", [strong1, strong2]);
        return;
    }
    Promise.all([
        strongRepo.getItem(strong1),
        strongRepo.getItem(strong2),
        strongRepo.getBookVektors(strong1),
        strongRepo.getBookVektors(strong2)
    ]).then(([strongDescription1, strongDescription2, [relevanceVektor1, countVektor1], [relevanceVektor2, countVektor2]]) => {
        chart.destroy();
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: strongPrefix === 'H' ? bookIndexAt : bookIndexNt,
                datasets: [{
                    label: `Relative Häufigkeit von ${strongDescription1.transliteration}`,
                    data: relevanceVektor1,
                    borderWidth: 1,
                    borderColor: 'red'
                },{
                    label: `Relative Häufigkeit von ${strongDescription2.transliteration}`,
                    data: relevanceVektor2,
                    borderWidth: 1,
                    borderColor: 'green'
                }]
            },
            options: chartOptions
        });
    });
}

compareInputStrongs();


