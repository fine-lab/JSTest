let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let url = "https://www.example.com/";
    var xmlString =
      "<soapenv:Envelope xmlns:soapenv='https://www.example.com/' xmlns:urn='urn:sap-com:document:sap:rfc:functions'><soapenv:Header/><soapenv:Body><urn:ZFI_GEMS_INT_DOC_POST><IS_TEST>1</IS_TEST><I_MOD>1</I_MOD><TAB_HEADER><item><ROW_ID>1</ROW_ID><XREF1_HD>1</XREF1_HD><XBLNR>1</XBLNR><BUKRS>1</BUKRS><BLDAT>1</BLDAT><BUDAT>1</BUDAT><BLART>1</BLART><WAERS>1</WAERS><NUMPG>1</NUMPG><BKTXT>1</BKTXT><USNAM>1</USNAM><MONAT>1</MONAT></item></TAB_HEADER><TAB_ITEMS><item><BUZEI>1</BUZEI><ACC_TYPE>1</ACC_TYPE><SHKZG>1</SHKZG><BSCHL>1</BSCHL><HKONT>1</HKONT><UMSKZ>1</UMSKZ><HKONT_BX>1</HKONT_BX><KOSTL>1</KOSTL><PRCTR>1</PRCTR><AUFNR>1</AUFNR><RSTGR>1</RSTGR><WRBTR>1</WRBTR><DMBTR>1</DMBTR><MWSKZ>1</MWSKZ><FWBAS>1</FWBAS><HWBAS>1</HWBAS><SGTXT>1</SGTXT><VALUT>1</VALUT><ZFBDT>1</ZFBDT><ZBASE_DATE>1</ZBASE_DATE><ZUONR>1</ZUONR><XREF1>1</XREF1><XREF2>1</XREF2><WT_FLAG>1</WT_FLAG><WDATE>1</WDATE><WNAME>1</WNAME><WBZOG>1</WBZOG><WBANK>1</WBANK><WSTAT>1</WSTAT><IDXSP>1</IDXSP><HZUON>1</HZUON><NAME1>1</NAME1><ORT01>1</ORT01><XNEGP>1</XNEGP><ZTERM>1</ZTERM></item></TAB_ITEMS></urn:ZFI_GEMS_INT_DOC_POST></soapenv:Body></soapenv:Envelope>";
    let header = {
      "Content-Type": "text/xml;charset=UTF-8"
    };
    let strResponse = postman("post", url, "xml", JSON.stringify(header), xmlString);
    var jsonString = xml2json(strResponse);
    throw new Error(jsonString);
    return {};
  }
}
exports({ entryPoint: MyTrigger });