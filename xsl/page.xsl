<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xl="http://www.w3.org/2000/10/xlink-ns"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xi="http://www.w3.org/2001/XInclude"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:x="http://www.w3.org/1999/xhtml"
  xmlns:p="http://custom"
  xmlns="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" version="1.0" media-type="text/html" />

  <xsl:param name="param-site-url" select="'http://omiscid.gforge.inria.fr'"/>
  <xsl:param name="param-news-url" select="'http://gforge.inria.fr/news/?group_id=363'"/>
  <xsl:param name="param-news-feed-url" select="'http://gforge.inria.fr/export/rss_sfnews.php?group_id=363'"/>

  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>
          <xsl:value-of select="/p:page/p:title" />
        </title>
        <xsl:choose>
          <xsl:when test="count(/p:page/css) != 0">
            <xsl:for-each select="/p:page/css">
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
        <xsl:variable name="itemId" select="/p:page/p:currentMenu/@id"/>
        <meta name="keywords" content="omiscid, o3miscid, O3MiSCID, OMiSCID, {/p:page/p:menu/p:item[@id = $itemId]/text()}"/>
        <meta name="description" content="{/p:page/p:title/text()}"/>
        <meta name="abstract" content="{/p:page/p:title/text()}"/>
      </head>
      <body>
        <xsl:variable name="logoW" select="189"/>
        <xsl:variable name="logoH" select="146"/>
        <xsl:variable name="titleW" select="575"/>
        <xsl:variable name="titleH" select="88"/>
        <div id="container">
        <table class="layouttable" border="0" cellpadding="0" cellspacing="0">
          <tr class="header">
            <td rowspan="2" class="logocorner" width="{$logoW}" height="{$logoH}">
              <a href="index.xml">
                <img width="{$logoW}" height="{$logoH}" src="image/omiscid-logo.jpg" alt="logo" />
              </a>
            </td>
            <td class="titletop">
              <a href="index.xml">
                <img width="{$titleW}" height="{$titleH}" src="image/omiscid-title.jpg" alt="title" />
              </a>
            </td>
            <td width="100%" class="filltitlecorner"> </td>
          </tr>
          <tr class="header">
            <td colspan="2" height="{$logoH - $titleH}" valign="top" text-align="center">
              <div class="menu" align="center">
                <xsl:apply-templates select="/p:page/p:menu" />
              </div>
        </td></tr></table>
        <table class="layouttable" cellpadding="0" cellspacing="0">
          <tr><td class="outline" valign="top">
              <xsl:if test="count(/p:page/p:content/x:h1) + count(/p:page/p:content/x:h2) != 0">
                <div class="pagenameinoutline">
                  <!-- keep event if empty as a width-holder under IE -->
                  <xsl:variable name="itemId" select="/p:page/p:currentMenu/@id"/>
                  <xsl:apply-templates select="/p:page/p:menu/p:item[@id=$itemId]"/>
                </div>
                <xsl:apply-templates select="/p:page/p:content/x:h1 | /p:page/p:content/x:h2" mode="outline" />
              </xsl:if>
              <form class="search" method="get" action="http://www.google.com/search">
                  <input type="text"   name="q" value="" />
                  <input type="submit" value="Search" />
                  <input type="hidden"  name="sitesearch" value="{$param-site-url}" />
              </form>
            </td><td class="content" valign="top" width="100%">
              <!--div class="pagenameincontent">
                  <xsl:variable name="itemId" select="/p:page/p:currentMenu/@id"/>
                  <xsl:apply-templates select="/p:page/p:menu/p:item[@id=$itemId]"/>
              </div-->
              <xsl:apply-templates select="/p:page/p:content" />
          </td></tr><tr><td colspan="2" align="right">
        </td></tr></table>
        <table class="layouttable" cellpadding="0" cellspacing="0">
          <tr><td colspan="3" class="footer">
              <span>
                <xsl:apply-templates select="/p:page/p:footer" />
              </span>
              <div class="menu">
                <xsl:apply-templates select="/p:page/p:menu" />
              </div>
        </td></tr></table>
        </div>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="/p:page/p:menu">
    <xsl:for-each select="p:item">
      <xsl:variable name="itemId" select="@id"/>
      <xsl:choose>
        <xsl:when test="/p:page/p:currentMenu[@id=$itemId]">
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

  <xsl:template match="//p:svg">
      <a class="linktosvg" title="View Full SVG Version">
          <xsl:attribute name="href">
              <xsl:call-template name="globalReplace">
                  <xsl:with-param name="outputString" select="preceding-sibling::x:img/@src" />
                  <xsl:with-param name="target" select="'.jpg'" />
                  <xsl:with-param name="replacement" select="'.svg'" />
              </xsl:call-template>
          </xsl:attribute>
          <xsl:text>[svg]</xsl:text>
      </a>
  </xsl:template>

  <xsl:template name="omiscid" match="//p:omiscid | //x:omiscid">
    <span class="omiscid">
      <xsl:text>O</xsl:text>
      <sup>3</sup>
      <xsl:text>MiSCID</xsl:text>
    </span>
    <xsl:text></xsl:text>
  </xsl:template>
  
  <xsl:template match="//p:newsinfo | //x:newsinfo">
    <span class="newsinfo">
      <p>You can consult the <a href="{$param-news-url}"><xsl:call-template name="omiscid"/> news</a> or subscribe to <a href="{$param-news-feed-url}">the <xsl:call-template name="omiscid"/> news feed</a>.</p>
    </span>
    <xsl:text></xsl:text>
  </xsl:template>

  <xsl:template name="copyme">
    <xsl:copy>
      <xsl:copy-of select="attribute::*" />
      <xsl:apply-templates />
    </xsl:copy>
  </xsl:template>

  <xsl:template match="/p:page/p:content//* | /p:page/p:footer//* | /p:page/p:header//*">
    <xsl:call-template name="copyme" />
  </xsl:template>

  <xsl:template match="/p:page/p:content | /p:page/p:footer | /p:page/p:header">
    <xsl:apply-templates />
  </xsl:template>

  <xsl:template match="/p:page/p:content/x:h1">
    <h1><xsl:copy-of select="attribute::*" /><a class="gototop" href="" title="Page Top"/><xsl:call-template name="addAnchor" /></h1>
  </xsl:template>

  <xsl:template match="/p:page/p:content/x:h2">
    <h2><xsl:copy-of select="attribute::*" /><a class="gototop" href="" title="Page Top"/><xsl:call-template name="addAnchor" /></h2>
  </xsl:template>

  <xsl:template name="addAnchor">
    <a>
      <xsl:attribute name="name">a-<xsl:number count="x:h1 | x:h2" format="1-1" from="document" level="multiple"/>
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
  
  <xsl:template match="//x:h1" mode="outline">
    <h1><xsl:copy-of select="attribute::*" /><xsl:call-template name="outline-content"/></h1>
  </xsl:template>

  <xsl:template match="//x:h2" mode="outline">
    <h2><xsl:copy-of select="attribute::*" /><xsl:call-template name="outline-content"/></h2>
  </xsl:template>
  
  <xsl:template name="outline-content">
      <a>
      <xsl:attribute name="href">#a-<xsl:number count="x:h1 | x:h2" format="1-1" from="document" level="multiple"/>
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
