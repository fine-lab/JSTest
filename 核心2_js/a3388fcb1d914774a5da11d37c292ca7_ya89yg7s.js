let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var ids = request.id;
    var data = request.data;
    let len = data.length;
    var msgs = [];
    for (let i = 0; i < len; i++) {
      var Axml =
        "<soapenv:Envelope xmlns:soapenv='https://www.example.com/' xmlns:urn='urn:sap-com:document:sap:rfc:functions'><soapenv:Header/><soapenv:Body><urn:ZFI_GEMS_INT_DOC_REV_POST>";
      var Bxml = "<INPUT><BELNS>1</BELNS><BUKRS>1</BUKRS><GJAHS>1</GJAHS><STGRD>1</STGRD><BUDAT>1</BUDAT><MONAT>1</MONAT><VOIDR>1</VOIDR><USNAM>1</USNAM></INPUT>";
      var Cxml = "</urn:ZFI_GEMS_INT_DOC_REV_POST></soapenv:Body></soapenv:Envelope>";
      var xmlString = Axml + Bxml + Cxml;
      let url = "https://www.example.com/";
      let header = {
        "Content-Type": "text/xml;charset=UTF-8"
      };
      let strResponse = postman("post", url, "xml", JSON.stringify(header), xmlString);
      var jsonString = xml2json(strResponse);
      const obj = JSON.parse(jsonString);
      let FLAG = obj["SOAP-ENV:Body"]["urn:ZFI_GEMS_INT_DOC_REV_POST.Response"]["OUTPUT"]["O_FLAG"];
      let MESSAGE = obj["SOAP-ENV:Body"]["urn:ZFI_GEMS_INT_DOC_REV_POST.Response"]["OUTPUT"]["O_MESSAGE"];
      if (FLAG == "E") {
        msgs.push("凭证号:" + data[i][0].billcode + "同步失败，错误信息:" + MESSAGE);
      } else {
        msgs.push("凭证号:" + data[i][0].billcode + "同步成功。");
      }
    }
    return { rs: msgs };
  }
}
exports({ entryPoint: MyAPIHandler });