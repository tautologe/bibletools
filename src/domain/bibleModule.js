class BibleModule {
    constructor (moduleKey, description, bookNames) {
        this.moduleKey = moduleKey;
        this.description = description;
        this.bookNames = bookNames;
    }

    mapBook (bookName) {
        return this.bookNames[bookName];
    }
}

BibleModule.LUT1912 = new BibleModule('LUT1912', 'Luther 1912', {
    'Gen': '1Mo',
    'Jos': 'Jos',
    'Röm': 'Röm',
    'Offb': 'Offb',
    'Ex':'2Mo',
    'Lev':'3Mo',
    'Num':'4Mo',
    'Dtn':'5Mo',
    'Ri':'Ri',
    'Rut':'Rt',
    '1 Sam':'1Sam',
    '2 Sam':'2Sam',
    '1 Kön':'1Kö',
    '2 Kön':'2Kö',
    '1 Chr':'1Chr',
    '2 Chr':'2Chr',
    'Esra':'Esr', 
    'Neh':'Neh',
    'Tob':'Tob',
    'Jdt':'Jdt',
    'Est':'Est',
    '1 Makk':'1Makk',
    '2 Makk':'2Makk',
    'Ijob':'Hi',
    'Ps':'Ps',
    'Spr':'Spr',
    'Koh':'Pred',
    'Hld':'Hl',
    'Weish':'Weish',
    'Sir':'Sir',
    'Jes':'Jes',
    'Jer':'Jer',
    'Klgl':'Kla',
    'Bar':'Bar',
    'Ez':'Hes',
    'Dan':'Dan',
    'Hos':'Hos',
    'Joel':'Joe',
    'Am':'Am',
    'Obd':'Ob',
    'Jona':'Jon',
    'Mi':'Mi',
    'Nah':'Nah',
    'Hab':'Hab',
    'Zef':'Zeph',
    'Hag':'Hag',
    'Sach':'Sach',
    'Mal':'Mal',
    'Mt':'Mt',
    'Mk':'Mk',
    'Lk':'Lk',
    'Joh':'Joh',
    'Apg':'Apg',
    '1 Kor':'1Kor',
    '2 Kor':'2Kor',
    'Gal':'Gal',
    'Eph':'Eph',
    'Phil':'Phil',
    'Kol':'Kol',
    '1 Thess':'1Thes',
    '2 Thess':'2Thes',
    '1 Tim':'1Tim',
    '2 Tim':'2Tim',
    'Tit':'Tit',
    'Phlm':'Phim',
    'Hebr':'Hebr',
    'Jak':'Jak',
    '1 Petr':'1Petr',
    '2 Petr':'2Petr',
    '1 Joh':'1Jo',
    '2 Joh':'2Jo',
    '3 Joh':'3Jo',
    'Jud':'Jud'
});


export {
    BibleModule
};







