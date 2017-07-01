<xsl:stylesheet
  version="2.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns="http://www.w3.org/1999/xhtml">
<xsl:output method="text" encoding="UTF-8" media-type="text/plain"/>
<xsl:strip-space elements="BIBLEBOOK"/>


<xsl:template match="XMLBIBLE">
    <xsl:text>{ "information": {</xsl:text>
    <xsl:apply-templates select="INFORMATION" />
    <xsl:text>},&#xa;"books": [&#xa;</xsl:text>
    <xsl:apply-templates select="BIBLEBOOK" />
    <xsl:text>]} </xsl:text>
</xsl:template>

<xsl:template match="INFORMATION">
    <xsl:text>"identifier": "</xsl:text><xsl:value-of select="./identifier" /><xsl:text>",</xsl:text>
    <xsl:text>"title": "</xsl:text><xsl:value-of select="./title" /><xsl:text>",</xsl:text>
    <xsl:text>"subject": "</xsl:text><xsl:value-of select="./subject" /><xsl:text>",</xsl:text>
    <xsl:text>"description": "</xsl:text><xsl:value-of select="./description" /><xsl:text>",</xsl:text>
    <xsl:text>"language": "</xsl:text><xsl:value-of select="./language" /><xsl:text>"</xsl:text>
</xsl:template>

<xsl:template match="BIBLEBOOK">
    <xsl:text>{</xsl:text>
    <xsl:text>"bnumber": "</xsl:text><xsl:value-of select="@bnumber" /><xsl:text>",</xsl:text>
    <xsl:text>"bname": "</xsl:text><xsl:value-of select="@bname" /><xsl:text>",</xsl:text>
    <xsl:text>"bsname": "</xsl:text><xsl:value-of select="@bsname" /><xsl:text>",</xsl:text>
    <xsl:text>"numberOfChapters": </xsl:text><xsl:value-of select="count(./CHAPTER)" /><xsl:text>,</xsl:text>
    <xsl:text>"chapters": [</xsl:text><xsl:apply-templates /><xsl:text>]</xsl:text>
    <xsl:text>}</xsl:text>
    <xsl:if test="count(following-sibling::BIBLEBOOK[.]) > 0"><xsl:text>,&#xa;</xsl:text></xsl:if>
</xsl:template>

<xsl:template match="CHAPTER">
    <xsl:text>{</xsl:text>
    <xsl:text>"cnumber": "</xsl:text><xsl:value-of select="@cnumber" /><xsl:text>",</xsl:text>
    <xsl:text>"numberOfVerses": </xsl:text><xsl:value-of select="count(./VERS)" />
    <xsl:text>}</xsl:text>
    <xsl:if test="count(following-sibling::CHAPTER[.]) > 0"><xsl:text>,&#xa;</xsl:text></xsl:if>
</xsl:template>


</xsl:stylesheet>
