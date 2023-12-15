let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取数据中心url
    let funcUrl = extrequire("ST.backDesignerFunction.gateWayUrl");
    let urlRes = funcUrl.execute(null);
    var gatewayUrl = urlRes.gatewayUrl;
    var updateUrl = gatewayUrl + "/yonbip/scm/salesout/single/update";
    let resubmitCheckKey = replace(uuid(), "-", "");
    let queryBillSql = "select * from st.salesout.SalesOut where id='" + request.id + "'";
    var bill = ObjectStore.queryByYonQL(queryBillSql, "ustock");
    var bodyData = {
      resubmitCheckKey: resubmitCheckKey,
      _status: "Update",
      id: request.id,
      salesOutDefineCharacter: {
        id: bill[0].salesOutDefineCharacter.id,
        attrext9: request.tracknum //快递单号
      }
    };
    let body = { data: bodyData };
    var strResponse = openLinker("POST", updateUrl, "ST", JSON.stringify(body));
    var responseObj = JSON.parse(strResponse);
    if (responseObj.code != 200) {
      throw new Error("回更快递单号出错：" + responseObj.message);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });