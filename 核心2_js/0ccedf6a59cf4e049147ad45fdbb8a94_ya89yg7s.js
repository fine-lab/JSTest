let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var ids = request.ids;
    let len = ids.length;
    var msgs = [];
    for (let i = 0; i < len; i++) {
      var id = ids[i];
      //根据凭证集成的id查询
      var Sql = "select flag,yspzid,sappzno from AT19D33B7809D80002.AT19D33B7809D80002.cxpzjc01 where id =" + "'" + id + "'";
      var res = ObjectStore.queryByYonQL(Sql);
      var yspzid = res[0]["yspzid"];
      var flag = res[0]["flag"];
      if (flag === "否") {
        msgs.push(yspzid + "未同步，不用处理。");
        continue;
      } else {
        var BELNS = res[0]["sappzno"];
        //公司代码
        var BUKRS = "1SR0";
        //会计年度
        var GJAHS = "2023";
        var xml =
          "<soapenv:Envelope xmlns:soapenv='https://www.example.com/' xmlns:urn='urn:sap-com:document:sap:rfc:functions'><soapenv:Header/><soapenv:Body><urn:ZFI_GEMS_INT_DOC_REV_POST><INPUT><BELNS>" +
          BELNS +
          "</BELNS><BUKRS>" +
          BUKRS +
          "</BUKRS><GJAHS>" +
          GJAHS +
          "</GJAHS><STGRD>02</STGRD><BUDAT></BUDAT><MONAT></MONAT><VOIDR></VOIDR><USNAM>HSC</USNAM></INPUT></urn:ZFI_GEMS_INT_DOC_REV_POST></soapenv:Body></soapenv:Envelope>";
        let url = "https://www.example.com/";
        let header = {
          "Content-Type": "text/xml;charset=UTF-8"
        };
        let strResponse = postman("post", url, "xml", JSON.stringify(header), xml);
        var jsonString = xml2json(strResponse);
        const obj = JSON.parse(jsonString);
        let O_FLAG = obj["SOAP-ENV:Body"]["urn:ZFI_GEMS_INT_DOC_REV_POST.Response"]["OUTPUT"]["O_FLAG"];
        let O_MESSAGE = obj["SOAP-ENV:Body"]["urn:ZFI_GEMS_INT_DOC_REV_POST.Response"]["OUTPUT"]["O_MESSAGE"];
        if (O_FLAG == "E") {
          msgs.push("YS凭证id:" + yspzid + ",同步失败,错误信息:" + O_MESSAGE);
        } else {
          var object = { id: id, flag: "否", sappzno: "", sendsapid: "", _status: "Update" };
          var res = ObjectStore.updateById("AT19D33B7809D80002.AT19D33B7809D80002.cxpzjc01", object, "cxpzjc01");
          msgs.push("YS凭证id:" + yspzid + ",取消成功。");
        }
      }
    }
    return { rs: msgs };
  }
}
exports({ entryPoint: MyAPIHandler });