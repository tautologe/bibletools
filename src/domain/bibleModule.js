const bookIndex = ["","Gen","Ex","Lev","Num","Dtn","Jos","Ri","Rut","1 Sam","2 Sam","1 Kön","2 Kön","1 Chr","2 Chr","Esra","Neh","Est","Ijob","Ps","Spr","Koh","Hld","Jes","Jer","Klgl","Ez","Dan","Hos","Joel","Am","Obd","Jona","Mi","Nah","Hab","Zef","Hag","Sach","Mal","Mt","Mk","Lk","Joh","Apg","Röm","1 Kor","2 Kor","Gal","Eph","Phil","Kol","1 Thess","2 Thess","1 Tim","2 Tim","Tit","Phlm","Hebr","Jak","1 Petr","2 Petr","1 Joh","2 Joh","3 Joh","Jud","Offb"]

class BibleModule {
    constructor (moduleKey, description, bookNames) {
        this.moduleKey = moduleKey;
        this.description = description;
        this.bookNames = bookNames;
    }

    mapBook (bookName) {
        return this.bookNames.indexOf(bookName);
    }
}

BibleModule.LUT1912 = new BibleModule('LUT1912AP', 'Luther 1912', bookIndex);
BibleModule.ELB1905 = new BibleModule('ELB1905STR', 'Elberfelder 1905', bookIndex);

export {
    BibleModule
};







