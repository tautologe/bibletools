<!-- Convert Zefania Konkordanz to JSON format -->
<!-- TODO: link references -->
<xsl:stylesheet
  version="2.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns="http://www.w3.org/1999/xhtml">
    <xsl:output method="text" encoding="UTF-8" media-type="text/plain"/>

    <xsl:variable name="strongDict" select="document('../../../strong.xml')" />

    <xsl:template match="dictionary">
        <xsl:apply-templates />
    </xsl:template>
    
    <xsl:template match="item">
        <xsl:variable name="strongDictItem" select="$strongDict/dictionary/item[@id=current()/@id]" />

        <xsl:result-document href="output/strong/{@id}.json" method="text">
            <xsl:text>{ "id": "</xsl:text><xsl:value-of select="@id" /><xsl:text>",&#xa;</xsl:text>
            <xsl:text>"title_konk": "</xsl:text><xsl:value-of select="./title" /><xsl:text>",&#xa;</xsl:text>
            <xsl:text>"title_strongs": "</xsl:text><xsl:value-of select="$strongDictItem/title" /><xsl:text>",&#xa;</xsl:text>
            <xsl:text>"transliteration": "</xsl:text><xsl:value-of select="$strongDictItem/transliteration" /><xsl:text>",&#xa;</xsl:text>
            <xsl:text>"germanDescription": [</xsl:text><xsl:apply-templates select="./description/title" /><xsl:text>],&#xa;</xsl:text>
            <xsl:text>"englishDescription": [</xsl:text><xsl:apply-templates select="$strongDictItem/description" /><xsl:text>],&#xa;</xsl:text>
            <xsl:text>"occurrences": [</xsl:text><xsl:apply-templates select="./description/reflink" /><xsl:text>]</xsl:text>
            <xsl:text>}</xsl:text>
        </xsl:result-document>
    </xsl:template>

    <xsl:template match="item/description/title">
        <xsl:text>"</xsl:text><xsl:apply-templates /><xsl:text>"</xsl:text>
        <xsl:if test="count(../following-sibling::description[.]) > 0"><xsl:text>,</xsl:text></xsl:if>
    </xsl:template>

    <xsl:template match="/dictionary/item/description">
        <xsl:text>"</xsl:text><xsl:apply-templates /><xsl:text>"</xsl:text>
        <xsl:if test="count(../following-sibling::description[.]) > 0"><xsl:text>,</xsl:text></xsl:if>
    </xsl:template>

    <xsl:template match="item/description/reflink">
        <xsl:text>"</xsl:text><xsl:value-of select="@mscope" /><xsl:text>"</xsl:text>
        <xsl:if test="count(../following-sibling::reflink[.]) > 0"><xsl:text>,</xsl:text></xsl:if>
    </xsl:template>


<xsl:template match="text()">
    <xsl:call-template name="replace">
        <xsl:with-param name="string" select="."/>
        <xsl:with-param name="search" select="'&quot;'" />
        <xsl:with-param name="replace-with" select="'\&quot;'" />
    </xsl:call-template>
</xsl:template>

<xsl:template match="INFORMATION" />

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
