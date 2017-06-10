FROM java:8-jre

RUN apt update && apt install -y libsaxonhe-java libsaxonb-java

COPY ./module-converter/ /converter/
COPY ./fetchBible.sh /fetchBible.sh
COPY ./data/strong.xml /strong.xml
