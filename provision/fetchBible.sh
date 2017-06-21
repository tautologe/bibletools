#!/bin/bash

# Download bible modules and resources
wget -qO lut1912.zip https://downloads.sourceforge.net/project/zefania-sharp/Bibles/GER/Lutherbibel/Luther%201912%20-%20mit%20Apokryphen/SF_2006-12-20_GER_LUTH1912AP_%28LUTHER%201912%20-%20MIT%20APOKRYPHEN%29.zip
unzip lut1912.zip
mv "SF_2006-12-20_GER_LUTH1912AP_(LUTHER 1912 - MIT APOKRYPHEN).xml" lut1912.xml

wget -qO lut1545.zip https://downloads.sourceforge.net/project/zefania-sharp/Bibles/GER/Lutherbibel/Luther%201545%20mit%20Strongs/SF_2009-01-20_GER_LUTH1545STR_%28LUTHER%201545%20MIT%20STRONGS%29.zip
unzip lut1545.zip
mv "SF_2009-01-20_GER_LUTH1545STR_(LUTHER 1545 MIT STRONGS).xml" lut1545.xml

wget -qO elb1905-konkordanz.zip https://downloads.sourceforge.net/project/zefania-sharp/Dictionaries/GER/Die%20Elberfelderbibel%20von%201905%20-%20Konkordanz/SF_2006-03-08_GER_ELB1905-KOK_%28DIE%20ELBERFELDERBIBEL%20VON%201905%20-%20KONKORDANZ%29.zip
unzip elb1905-konkordanz.zip
mv "SF_2006-03-08_GER_ELB1905-KOK_(DIE ELBERFELDERBIBEL VON 1905 - KONKORDANZ).xml" elb1905-konkordanz.xml

wget -qO elb1905.zip https://downloads.sourceforge.net/project/zefania-sharp/Bibles/GER/Elberfelder/Elberfelder%201905/SF_2009-01-22_GER_ELB1905STR_%28ELBERFELDER%201905%29.zip
unzip elb1905.zip
mv "SF_2009-01-22_GER_ELB1905STR_(ELBERFELDER 1905).xml" elb1905.xml

wget -q http://bgfdb.de/zefania.de/wp-content/uploads/2017/05/linklist.zip
unzip linklist.zip

cd /shared

mkdir -p /shared/demo/repo
chmod -R a+w /shared/demo/repo

# Transform bible module
saxonb-xslt -xsl:provision/zefania2json.xslt -s:/lut1912.xml  -ext:on externalStrongBibleFileName="/lut1545.xml" outputDirectory="/shared/demo/repo" > /dev/null
# Transform bible module
saxonb-xslt -xsl:provision/zefania2json.xslt -s:/elb1905.xml  -ext:on outputDirectory="/shared/demo/repo" > /dev/null
# Transform Konkordanz and Strong module
saxonb-xslt -xsl:provision/konkordanz.xslt -s:/elb1905-konkordanz.xml -ext:on externalStrongDictFileName="/shared/provision/strong.xml" outputDirectory="/shared/demo/repo" > /dev/null
# Transform linklist
saxonb-xslt -xsl:provision/linklist.xslt -s:/linklist.xml -o:/shared/demo/repo/linklist.json -ext:on

chmod -R a+w /shared/demo/repo
