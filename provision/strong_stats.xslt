<xsl:stylesheet
  version="2.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns="http://www.w3.org/1999/xhtml">
<xsl:output method="text" encoding="UTF-8" media-type="text/plain"/>
<xsl:strip-space elements="BIBLEBOOK"/>


<xsl:template match="XMLBIBLE">
    <xsl:text>[</xsl:text>
    <xsl:apply-templates select="BIBLEBOOK" />
    <xsl:text>]</xsl:text>
</xsl:template>


<xsl:template match="BIBLEBOOK">
    <xsl:variable name="strongGroup" as="element()*">
      <strongs>
      <xsl:for-each-group select="./CHAPTER/VERS/gr" group-by="@str">
      <xsl:sort select="count(current-group())" order="descending"></xsl:sort>
        <strong xyz="abc">
        <xsl:text>{"</xsl:text><xsl:apply-templates select="../../.." mode="language" /><xsl:value-of select="current-grouping-key()"/><xsl:text>": "</xsl:text>
        <xsl:value-of select="count(current-group())"/><xsl:text>"}</xsl:text>
        </strong>
      </xsl:for-each-group>
      </strongs>
    </xsl:variable>

    <xsl:text>{</xsl:text>
    <xsl:text>"bnumber": "</xsl:text><xsl:value-of select="@bnumber" /><xsl:text>",</xsl:text>
    <xsl:text>"bname": "</xsl:text><xsl:value-of select="@bname" /><xsl:text>",</xsl:text>
    <xsl:text>"bsname": "</xsl:text><xsl:value-of select="@bsname" /><xsl:text>",</xsl:text>
    <xsl:text>"strongs": [</xsl:text>
        <xsl:for-each select="$strongGroup">
            <xsl:for-each select="./child::*">
                <xsl:value-of select="." />
                <xsl:if test="count(following-sibling::*) > 0"><xsl:text>,&#xa;</xsl:text></xsl:if>    
            </xsl:for-each>
        </xsl:for-each>
    <xsl:text>]</xsl:text>
    <xsl:text>}</xsl:text>
    <xsl:if test="count(following-sibling::BIBLEBOOK[.]) > 0"><xsl:text>,&#xa;</xsl:text></xsl:if>
</xsl:template>

<xsl:template match="BIBLEBOOK" mode="language">
    <xsl:choose>
        <xsl:when test="@bnumber &lt; 40"><xsl:text>H</xsl:text></xsl:when>
        <xsl:otherwise><xsl:text>G</xsl:text></xsl:otherwise>
    </xsl:choose>
</xsl:template>

</xsl:stylesheet>
