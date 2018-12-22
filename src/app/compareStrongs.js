/* global document */
import StrongRepo from '../repo/StrongRepo.js';
import {JSONLoader} from '../util/jsonLoader.js';
import Chart from 'chart.js';

const strongRepo = new StrongRepo(JSONLoader);

const bookIndexAt = ["Gen","Ex","Lev","Num","Dtn","Jos","Ri","Rut","1 Sam","2 Sam","1 Kön","2 Kön","1 Chr","2 Chr","Esra","Neh","Est","Ijob","Ps","Spr","Koh","Hld","Jes","Jer","Klgl","Ez","Dan","Hos","Joel","Am","Obd","Jona","Mi","Nah","Hab","Zef","Hag","Sach","Mal"]
const bookIndexNt = ["Mt","Mk","Lk","Joh","Apg","Röm","1 Kor","2 Kor","Gal","Eph","Phil","Kol","1 Thess","2 Thess","1 Tim","2 Tim","Tit","Phlm","Hebr","Jak","1 Petr","2 Petr","1 Joh","2 Joh","3 Joh","Jud","Offb"]


Promise.all([
    strongRepo.getItem('H430'), 
    strongRepo.getItem('H3068'),
    strongRepo.getBookVektors('H430'),
    strongRepo.getBookVektors('H3068')
]).then(([strongDescription1, strongDescription2, [relevanceVektor1, countVektor1], [relevanceVektor2, countVektor2]]) => {
    console.log(strongDescription1);
    console.log(strongDescription2);
    console.log(relevanceVektor1);

    var ctx = document.getElementById("strongCompareChart").getContext("2d");
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            //labels: strongPrefix === 'H' ? bookIndexAt : bookIndexNt,
            labels: bookIndexAt,
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
})
