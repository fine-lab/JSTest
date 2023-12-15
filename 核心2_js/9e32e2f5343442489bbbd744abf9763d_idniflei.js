let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    var token = obj.token;
    let func1 = extrequire("SCMSA.CommonFunction.baseConfig");
    let myConfig = func1.execute();
    let hostUrl = "https://www.example.com/";
    if (tid == "hr2u8ml4") {
      hostUrl = myConfig.config.apiUrl;
    }
    var idsString = "";
    for (var i = 0; i < param.data.length; i++) {
      idsString += param.data[i].id + ",";
    }
    var header = {
      "Content-Type": "application/json;charset=utf-8",
      yht_access_token: token
    };
    let apiAdderss = "/guize/SalesDeliveryAbandonAudit";
    apiAdderss += "?tenant_id=" + tid;
    apiAdderss += "&idsString=" + idsString;
    var strResponse = postman("get", hostUrl + apiAdderss, JSON.stringify(header), null);
    var objJSON = JSON.parse(strResponse);
    if (objJSON.status != 1) {
      throw new Error("操作失败!" + objJSON.message);
    } else {
      return "弃审成功";
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });