
OUT=out
SERVER=oberon
SERVERPATH=/var/www/OMiSCID/
DISTON=${USER}@${SERVER}:${SERVERPATH}

release: all-html
	rm -rf ${OUT}
	mkdir ${OUT}
	cp -r css image download *.html ${OUT}
#	cd ${OUT}/download && wget http://oberon/release/omiscid.jar
#	cd ${OUT}/download && wget http://oberon/release/omiscidGui.jar
#	find ${OUT} -name .svn -exec rm -rf {} \; || true

export: release
	rsync -avz --delete --exclude=.svn $(OUT)/ $(DISTON)

export-gforge:
	rsync -avzupOI --exclude=.svn  --chmod=g+w --delete $(OUT)/ omiscid.gforge.inria.fr:/home/groups/omiscid/htdocs || echo "!!! code 23 is normal !!!"

all-html: $(patsubst %.xml,%.html,$(wildcard *.xml))

%.html: %.xml $(wildcard xsl/*.xsl) $(wildcard common/*.xml)
	xsltproc --xinclude --output $@ xsl/page.xsl $<
	sed -i -e "s@[.]xml@.html@g" $@

