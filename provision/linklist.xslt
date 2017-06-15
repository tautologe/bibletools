<!-- Convert MyBible linklist.xml to JSON format -->
<xsl:stylesheet
  version="2.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns="http://www.w3.org/1999/xhtml">
  <xsl:output method="text" encoding="UTF-8" media-type="text/plain"/>

  <xsl:template match="collection">
    <xsl:text>{</xsl:text>
    <xsl:apply-templates />
    <xsl:text>}</xsl:text>
  </xsl:template>

  <xsl:template match="verse">
    <xsl:text>"</xsl:text>
    <xsl:value-of select="@bn" />
    <xsl:text>;</xsl:text>
    <xsl:value-of select="@cn" />
    <xsl:text>;</xsl:text>
    <xsl:value-of select="@vn" />
    <xsl:text>": [</xsl:text>
    <xsl:apply-templates />
    <xsl:text>]</xsl:text>
    <xsl:if test="count(following-sibling::verse[.]) > 0"><xsl:text>,&#xa;</xsl:text></xsl:if>
  </xsl:template>

  <xsl:template match="verse/link">
    <xsl:text>"</xsl:text>
    <xsl:value-of select="@bn" />
    <xsl:text>;</xsl:text>
    <xsl:value-of select="@cn1" />
    <xsl:text>;</xsl:text>
    <xsl:value-of select="@vn1" />
    <xsl:if test="@vn2">
        <xsl:text>-</xsl:text>
        <xsl:value-of select="@vn2" />
    </xsl:if>
    <xsl:text>"</xsl:text>
    <xsl:if test="count(following-sibling::link[.]) > 0"><xsl:text>,</xsl:text></xsl:if>
  </xsl:template>

  <xsl:template match="text()" />

</xsl:stylesheet>
