

all-html: $(patsubst %.xml,%.html,$(wildcard *.xml))

%.html: %.xml $(wildcard xsl/*.xsl) $(wildcard common/*.xml)
	xsltproc --xinclude --output $@ xsl/page.xsl $<
	sed -i -e "s@[.]xml@.html@g" $@
