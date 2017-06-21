<xsl:stylesheet
  version="2.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns="http://www.w3.org/1999/xhtml">
<xsl:output method="text" encoding="UTF-8" media-type="text/plain"/>
<xsl:strip-space elements="VERS"/>

<xsl:param name="externalStrongBibleFileName"/>
<xsl:variable name="externalStrongBible" select="document($externalStrongBibleFileName)" />

<xsl:param name="outputDirectory"/>
<xsl:variable name="bibleRoot"><xsl:value-of select="$outputDirectory" />/bible/<xsl:value-of select="/XMLBIBLE/INFORMATION/identifier" /></xsl:variable>

<xsl:template match="BIBLEBOOK">
    <xsl:apply-templates />
    <xsl:result-document href="{$bibleRoot}/{(@bsname | @bnumber)[1]}/meta.json" method="text">
    <xsl:text>{ "bname": "</xsl:text>
    <xsl:value-of select="@bname" />
    <xsl:text>", "bsname": "</xsl:text>
    <xsl:value-of select="@bsname" />
    <xsl:text>", "numberOfChapters": "</xsl:text>
    <xsl:value-of select="count(./CHAPTER)" />
    <xsl:text>"}</xsl:text>
    </xsl:result-document>
</xsl:template>

<xsl:template match="CHAPTER">
    <xsl:result-document href="{$bibleRoot}/{../(@bsname | @bnumber)[1]}/{@cnumber}.json" method="text">
    <xsl:text>{ "chapter": </xsl:text>
    <xsl:value-of select="@cnumber" />
    <xsl:text>, "verses": [</xsl:text>
        <xsl:apply-templates/>
    <xsl:text>]}</xsl:text>
    </xsl:result-document>
</xsl:template>

<xsl:template match="VERS">
    <xsl:text>{ "verse": </xsl:text>
    <xsl:value-of select="@vnumber" />
    <xsl:text>, "text": "</xsl:text>
    <xsl:apply-templates />
    <xsl:text>", "strongs": [</xsl:text>
    <xsl:choose>
        <xsl:when test="$externalStrongBible">
            <xsl:apply-templates select="$externalStrongBible/XMLBIBLE/BIBLEBOOK[
                @bnumber = current()/../../@bnumber]/CHAPTER[@cnumber = current()/../@cnumber]/VERS[@vnumber=current()/@vnumber]/gr" mode="list"/>
        </xsl:when>
        <xsl:otherwise>
            <xsl:apply-templates select="./gr" mode="list"/>
        </xsl:otherwise>
    </xsl:choose>
    <xsl:text>]}</xsl:text>
    <xsl:if test="count(following-sibling::VERS[.]) > 0"><xsl:text>,</xsl:text></xsl:if>
</xsl:template>

<xsl:template match="gr" mode="list">
    <xsl:text>"</xsl:text>
    <xsl:apply-templates select="../../.." mode="language" />
    <xsl:value-of select="@str" />
    <xsl:text>"</xsl:text>
    <xsl:if test="count(following-sibling::gr[.]) > 0"><xsl:text>,</xsl:text></xsl:if>
</xsl:template>

<xsl:template match="gr">
    <xsl:apply-templates select="./text()" />
    <xsl:text>[</xsl:text>
    <xsl:apply-templates select="../../.." mode="language" />
    <xsl:value-of select="@str" />
    <xsl:text>]</xsl:text>
</xsl:template>

<xsl:template match="BIBLEBOOK" mode="language">
    <xsl:choose>
        <xsl:when test="@bnumber &lt; 40"><xsl:text>H</xsl:text></xsl:when>
        <xsl:otherwise><xsl:text>G</xsl:text></xsl:otherwise>
    </xsl:choose>
</xsl:template>


<xsl:template match="INFORMATION" />

<xsl:template match="text()">
    <xsl:call-template name="replace">
        <xsl:with-param name="string" select="."/>
        <xsl:with-param name="search" select="'&quot;'" />
        <xsl:with-param name="replace-with" select="'\&quot;'" />
    </xsl:call-template>
</xsl:template>

<xsl:template match="DIV" />

<xsl:template name="replace">
    <xsl:param name="string" />
    <xsl:param name="search" />
    <xsl:param name="replace-with" />
    <xsl:choose>
            <xsl:when test="contains($string, $search)">
                <xsl:value-of select="substring-before($string, $search)" />
                <xsl:value-of select="$replace-with" />
                <xsl:call-template name="replace">
                    <xsl:with-param name="string" select="substring-after($string, $search)" />
                    <xsl:with-param name="search" select="$search" />
                    <xsl:with-param name="replace-with" select="$replace-with" />
                </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$string" />
            </xsl:otherwise>
        </xsl:choose>
</xsl:template>


</xsl:stylesheet>