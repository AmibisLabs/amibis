
OUT=out
SERVER=oberon
SERVERPATH=/var/www/OMiSCID/
DISTON=${USER}@${SERVER}:${SERVERPATH}

release: all-html patch-javadoc
	rm -rf ${OUT}
	mkdir ${OUT}
	cp -r css image download *.html ${OUT}
#	cp -r Documents/Doc/ Documents/OMiSCID-C++Tutorial.pdf ${OUT}/download/
#	rm -rf ${OUT}/download/Doc/.svn  ${OUT}/css/.svn  ${OUT}/download/.svn ${OUT}/image/.svn
#	cd ${OUT}/download && wget http://oberon/release/omiscid.jar
#	cd ${OUT}/download && wget http://oberon/release/omiscidGui.jar
#	find ${OUT} -name .svn -exec rm -rf {} \; || true

export:
	rsync -avz --delete --exclude=.svn $(OUT)/ $(DISTON)

export-gforge:
	rsync -avzupOI --exclude=.svn --exclude=.xml --delete $(OUT)/ omiscid.gforge.inria.fr:/home/groups/omiscid/htdocs || echo "!!! code 23 is normal !!!"

all-html: $(patsubst %.xml,%.html,$(wildcard *.xml))

%.html: %.xml $(wildcard xsl/*.xsl) $(wildcard common/*.xml)
	xsltproc --xinclude --output $@ xsl/page.xsl $<
	sed -i -e "s@[.]xml@.html@g" $@

patch-javadoc:
	cp css/javadoc.css download/doc-java/javadoc/stylesheet.css

