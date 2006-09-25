<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xl="http://www.w3.org/2000/10/xlink-ns"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xi="http://www.w3.org/2001/XInclude"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" version="1.0" media-type="text/html" />

  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>
          <xsl:value-of select="/page/title" />
        </title>
        <xsl:choose>
          <xsl:when test="count(/page/css) != 0">
            <xsl:for-each select="/page/css">
              <link rel="stylesheet" type="text/css">
                <xsl:attribute name="href">
                  <xsl:apply-templates />
                </xsl:attribute>
              </link>
            </xsl:for-each>
          </xsl:when>
          <xsl:otherwise>
            <link href="css/base.css" rel="stylesheet" type="text/css" />
          </xsl:otherwise>
        </xsl:choose>
      </head>
      <body>
        <div class="header">
          <a href="index.xml">
            <xsl:apply-templates select="/page/header" />
            </a>
        </div>
        <table cellpadding="0" cellspacing="0"><tr><td valign="top">
        <div class="menu">
          <xsl:apply-templates select="/page/menu" />
        </div>
        <xsl:if test="count(/page/content/h1) + count(/page/content/h2) != 0">
        <div class="outline">
          <xsl:apply-templates select="/page/content/h1 | /page/content/h2" mode="outline" />
        </div>
        </xsl:if>
        </td><td valign="top" width="100%">
        <div class="content">
          <xsl:apply-templates select="/page/content" />
        </div>
        </td></tr><tr><td colspan="2" align="right">
        <div class="footer">
          <xsl:apply-templates select="/page/footer" />
        </div>
        </td></tr></table>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="/page/menu">
    <xsl:for-each select="item">
      <xsl:variable name="itemId" select="@id"/>
      <xsl:choose>
        <xsl:when test="/page/currentMenu[@id=$itemId]">
          <div class="currentmenuitem">
            <xsl:call-template name="globalReplace">
              <xsl:with-param name="outputString" select="text()" />
              <xsl:with-param name="target" select="' '" />
              <xsl:with-param name="replacement" select="' '" />
            </xsl:call-template>
            </div>
        </xsl:when>
        <xsl:otherwise>
          <div class="menuitem">
            <a>
              <xsl:attribute name="href">
                <xsl:value-of select="@link" />
              </xsl:attribute>
              <xsl:call-template name="globalReplace">
                <xsl:with-param name="outputString" select="text()" />
                <xsl:with-param name="target" select="' '" />
                <xsl:with-param name="replacement" select="'&#0160;'" />
              </xsl:call-template>
            </a>
          </div>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:for-each>
  </xsl:template>

  <xsl:template match="//omiscid">
    <span class="omiscid">
      <xsl:text>O</xsl:text>
      <sup>3</sup>
      <xsl:text>MiSCID</xsl:text>
    </span>
    <xsl:text></xsl:text>
  </xsl:template>

  <xsl:template name="copyme">
    <xsl:copy>
      <xsl:copy-of select="attribute::*" />
      <xsl:apply-templates />
    </xsl:copy>
  </xsl:template>

  <xsl:template match="/page/content//* | /page/footer//* | /page/header//*">
    <xsl:call-template name="copyme" />
  </xsl:template>

  <xsl:template match="/page/content | /page/footer | /page/header">
    <xsl:apply-templates />
  </xsl:template>

  <xsl:template match="/page/content/h1">
    <h1><xsl:copy-of select="attribute::*" /><xsl:call-template name="addAnchor" /></h1>
  </xsl:template>

  <xsl:template match="/page/content/h2">
    <h2><xsl:copy-of select="attribute::*" /><xsl:call-template name="addAnchor" /></h2>
  </xsl:template>

  <xsl:template name="addAnchor">
    <a>
      <xsl:attribute name="name">
        a-<xsl:number count="h1 | h2" format="1-1" from="document" level="multiple"/>
      </xsl:attribute>
      <xsl:apply-templates />
    </a>
  </xsl:template>

  <xsl:template name="globalReplace">
    <xsl:param name="outputString" />
    <xsl:param name="target" />
    <xsl:param name="replacement" />
    <xsl:choose>
      <xsl:when test="contains($outputString,$target)">
        <xsl:value-of select="concat(substring-before($outputString,$target),$replacement)" />
        <xsl:call-template name="globalReplace">
          <xsl:with-param name="outputString" select="substring-after($outputString,$target)" />
          <xsl:with-param name="target" select="$target" />
          <xsl:with-param name="replacement" select="$replacement" />
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$outputString" />
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <xsl:template match="//h1" mode="outline">
    <h1><xsl:copy-of select="attribute::*" /><xsl:call-template name="outline-content"/></h1>
  </xsl:template>

  <xsl:template match="//h2" mode="outline">
    <h2><xsl:copy-of select="attribute::*" /><xsl:call-template name="outline-content"/></h2>
  </xsl:template>
  
  <xsl:template name="outline-content">
      <a>
      <xsl:attribute name="href">
        #a-<xsl:number count="h1 | h2" format="1-1" from="document" level="multiple"/>
      </xsl:attribute>
      <xsl:call-template name="globalReplace">
        <xsl:with-param name="outputString">
          <xsl:apply-templates />
        </xsl:with-param>
        <xsl:with-param name="target" select="' '" />
        <xsl:with-param name="replacement" select="'&#0160;'" />
      </xsl:call-template>
      </a>
  </xsl:template>  
</xsl:stylesheet>
