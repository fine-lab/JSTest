let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    let hostUrl = "https://www.example.com/";
    if (tid == "ykrrxl7u") {
      hostUrl = "https://www.example.com/";
    }
    var idsString = "";
    for (var i = 0; i < param.data.length; i++) {
      idsString += param.data[i].id + ",";
    }
    var mydata = {
      idsString: idsString
    };
    var header = {
      "Content-Type": "application/json;charset=utf-8"
    };
    var strResponse = postman("get", hostUrl + "/guize/SalesDeliveryAbandonAudit?tenant_id=" + tid + "&idsString=" + idsString);
    var objJSON = JSON.parse(strResponse);
    if (objJSON.status != 1) {
      throw new Error("操作失败!");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });