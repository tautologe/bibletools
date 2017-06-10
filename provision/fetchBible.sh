#!/bin/bash
wget -qO lut1912.zip https://downloads.sourceforge.net/project/zefania-sharp/Bibles/GER/Lutherbibel/Luther%201912%20-%20mit%20Apokryphen/SF_2006-12-20_GER_LUTH1912AP_%28LUTHER%201912%20-%20MIT%20APOKRYPHEN%29.zip
unzip lut1912.zip
mv "SF_2006-12-20_GER_LUTH1912AP_(LUTHER 1912 - MIT APOKRYPHEN).xml" lut1912.xml

wget -qO lut1545.zip https://downloads.sourceforge.net/project/zefania-sharp/Bibles/GER/Lutherbibel/Luther%201545%20mit%20Strongs/SF_2009-01-20_GER_LUTH1545STR_%28LUTHER%201545%20MIT%20STRONGS%29.zip
unzip lut1545.zip
mv "SF_2009-01-20_GER_LUTH1545STR_(LUTHER 1545 MIT STRONGS).xml" lut1545.xml

wget -qO elb1912-konkordanz.zip https://downloads.sourceforge.net/project/zefania-sharp/Dictionaries/GER/Die%20Elberfelderbibel%20von%201905%20-%20Konkordanz/SF_2006-03-08_GER_ELB1905-KOK_%28DIE%20ELBERFELDERBIBEL%20VON%201905%20-%20KONKORDANZ%29.zip
unzip elb1912-konkordanz.zip
mv "SF_2006-03-08_GER_ELB1905-KOK_(DIE ELBERFELDERBIBEL VON 1905 - KONKORDANZ).xml" elb1912-konkordanz.xml

saxonb-xslt -xsl:/converter/zefania2json.xslt -s:lut1912.xml  -ext:on externalStrongBibleFileName="../lut1545.xml" > /dev/null

saxonb-xslt -xsl:/converter/konkordanz.xslt -s:elb1912-konkordanz.xml -ext:on externalStrongBibleFileName="../strong.xml" > /dev/null

wget -q http://bgfdb.de/zefania.de/wp-content/uploads/2017/05/linklist.zip
unzip linklist.zip
saxonb-xslt -xsl:/converter/linklist.xslt -s:linklist.xml -o:linklist.json -ext:on

