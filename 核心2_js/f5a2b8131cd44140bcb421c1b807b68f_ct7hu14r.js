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
    try {
      var warehouseId = param.data[0].id;
      var isEnabled = param.data[0].iUsed == "disable" ? "false" : "true";
      if (typeof warehouseId == "undefined") throw new Error("数据操作异常，请刷新重试!");
      var strResponse = postman("get", hostUrl + "/location/EditWarehouseById?tenant_id=" + tid + "&id=" + warehouseId + "&isEnabled=" + isEnabled, null, JSON.stringify(param.data[0]));
      var objJSON = JSON.parse(strResponse);
      if (objJSON.status !== 1) {
        throw new Error("操作失败，原因：" + objJSON.message);
      }
    } catch (e) {}
    return {};
  }
}
exports({ entryPoint: MyTrigger });