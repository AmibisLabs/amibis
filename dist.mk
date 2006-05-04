
out=out

release: all-html
	rm -rf ${out}
	mkdir ${out}
	cp -r css image download *.html ${out}
	cd ${out}          && find -name .svn -exec rm -rf {} \;
	cd ${out}/download && wget http://oberon/release/omiscid.jar
	cd ${out}/download && wget http://oberon/release/omiscidGui.jar

all-html: $(patsubst %.xml,%.html,$(wildcard *.xml))

%.html: %.xml $(wildcard xsl/*.xsl) $(wildcard common/*.xml)
	xsltproc --xinclude --output $@ xsl/page.xsl $<
	sed -i -e "s@[.]xml@.html@g" $@

