const bookIndex = ["","Gen","Ex","Lev","Num","Dtn","Jos","Ri","Rut","1 Sam","2 Sam","1 Kön","2 Kön","1 Chr","2 Chr","Esra","Neh","Est","Ijob","Ps","Spr","Koh","Hld","Jes","Jer","Klgl","Ez","Dan","Hos","Joel","Am","Obd","Jona","Mi","Nah","Hab","Zef","Hag","Sach","Mal","Mt","Mk","Lk","Joh","Apg","Röm","1 Kor","2 Kor","Gal","Eph","Phil","Kol","1 Thess","2 Thess","1 Tim","2 Tim","Tit","Phlm","Hebr","Jak","1 Petr","2 Petr","1 Joh","2 Joh","3 Joh","Jud","Offb"]

const stopWords = ["G2532","G846","G1519","G1151","G3756","G2192", "G1161",
"G1722", "G1063", "G3754", "G1909", "G2076", "G3004", "G2036", "G4314",
"G575", "G3956", "G2257", "G5216", "G2443", "G2228", "G4675", "G3588",
"G3739", "G5209", "G5213", "G5101", "G1096", "G1537", "G3326",
"H559", "H6440", "H2930", "H5922", "H6925"];

const strongStatsTemplate = (strongStatsJson, strongRepo) => {
    return Promise.all(strongStatsJson.map((book) => {
        const numberOfItems = 20;
        const fontSize = (position) => {
            const [small, big] = [10, 30];
            const stepsize = (big - small) / numberOfItems;
            return small + ((numberOfItems - position) * stepsize);
        }
        const strongPromises = book.strongs
        .map((strongReference) => Object.keys(strongReference)[0])
        .filter((strongKey) => stopWords.indexOf(strongKey) === -1)
        .slice(0, numberOfItems - 1)
        .map((strongKey, index) => {
            return strongRepo.getItem(strongKey).then((strongDefinition) => {
                const title = strongDefinition.occurrences[0].title.replace(/\([^)]*\)/, '').trim();
                return `<span class="strongReference" style="font-size: ${fontSize(index)}px" data-strongkey="${strongKey}">${title}</span>`
            });
        });
        return Promise.all(strongPromises).then((strongHtmlArray) => strongHtmlArray.join(' ')).then((strongHtml) => {
            console.log(strongHtml);
            return `<div class="book strongContainer">
                <h1>${bookIndex[book.bnumber]}</h1>
                <div class="stronglist">${strongHtml}</div>
                <div class="strongDefinition"></div>
            </div>`
        });
    }));
};

export {strongStatsTemplate};
