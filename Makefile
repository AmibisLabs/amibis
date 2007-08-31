
OUT=out
SERVER=oberon
SERVERPATH=/var/www/OMiSCID/
DISTON=${USER}@${SERVER}:${SERVERPATH}

release: all-html patch-javadoc
	rm -rf ${OUT}
	mkdir ${OUT}
	cp -r css image download *.html ${OUT}
	cp sitemap.xml.in ${OUT}/sitemap.xml
	make import-screencasts

#	cp -r Documents/Doc/ Documents/OMiSCID-C++Tutorial.pdf ${OUT}/download/
#	rm -rf ${OUT}/download/Doc/.svn  ${OUT}/css/.svn  ${OUT}/download/.svn ${OUT}/image/.svn
#	cd ${OUT}/download && wget http://oberon/release/omiscid.jar
#	cd ${OUT}/download && wget http://oberon/release/omiscidGui.jar
#	find ${OUT} -name .svn -exec rm -rf {} \; || true

export:
	rsync -avz --chmod=g+rw --delete --exclude=.svn $(OUT)/* $(DISTON)

export-gforge:
	rsync -avz --chmod=g+rw --exclude=.svn --exclude=.xml --exclude=download/omiscidgui/* --delete $(OUT)/* omiscid.gforge.inria.fr:/home/groups/omiscid/htdocs/
	ssh omiscid.gforge.inria.fr chgrp -R omiscid /home/groups/omiscid/htdocs
#	ssh omiscid.gforge.inria.fr chmod -R g+rw /home/groups/omiscid/htdocs/\*

# HTML FILES GENERATION

all-html: $(patsubst %.xml,%.html,$(wildcard *.xml))

%.html: %.xml $(wildcard xsl/*.xsl) $(wildcard common/*.xml)
	xsltproc --xinclude --output $@ xsl/page.xsl $<
	sed -i -e "s@[.]xml@.html@g" $@

# JAVADOC IMPORT

import-javadoc:
	cd ../jOMiSCID/ && ant website-javadoc
	find download/doc-java/javadoc/ -type f -not -wholename '*/.svn*' -exec rm {} \;
	cd ../jOMiSCID/dist/javadocWebSite && find . \( -type d -exec mkdir -p ../../../OMiSCID-WebSite/download/doc-java/javadoc/{} \; \) -o \( -type f -exec cp {} ../../../OMiSCID-WebSite/download/doc-java/javadoc/{} \; \)
	find download/doc-java/javadoc/ -type f -name '*.html' -exec perl -pi -e 's@^<!-- Generated by javadoc .*@@g ; s@<META NAME="date" .*@@g' {} \;
	make patch-javadoc

patch-javadoc:
	cp css/javadoc.css download/doc-java/javadoc/stylesheet.css

# SCREENCASTS IMPORT

import-screencasts:
	rm -rf ${OUT}/screencasts
	mkdir ${OUT}/screencasts
	cp -r ../OMiSCIDDoc/* ${OUT}/screencasts/
	xsltproc --output ${OUT}/screencasts/screencasts.html ${OUT}/screencasts/screencasts.xsl ${OUT}/screencasts/screencasts.xml
	find ${OUT}/screencasts/ -name \.svn -exec rm -rf {} \; -prune
	find ${OUT}/screencasts/ -name \*.wnk -delete
	find ${OUT}/screencasts/ -name \*.xml -delete
	find ${OUT}/screencasts/ -name \*\~ -delete

