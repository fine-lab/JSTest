let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    let func1 = extrequire("GZTBDM.Config.baseConfig");
    let myConfig = func1.execute();
    // 检测需要访问的URL地址
    let hostUrl = "https://www.example.com/";
    if (tid == "hr2u8ml4") {
      hostUrl = myConfig.config.apiUrl;
    }
    var tid = obj.currentUser.tenantId;
    let token = obj.token;
    let header = {
      yht_access_token: token
    };
    try {
      var warehouseId = param.data[0].id;
      var isEnabled = param.data[0].iUsed == "disable" ? "false" : "true";
      if (typeof warehouseId == "undefined") throw new Error("数据操作异常，请刷新重试!");
      var strResponse = postman(
        "get",
        hostUrl + "/location/EditWarehouseById?tenant_id=" + tid + "&id=" + warehouseId + "&isEnabled=" + isEnabled,
        JSON.stringify(header),
        JSON.stringify(param.data[0])
      );
      var objJSON = JSON.parse(strResponse);
      if (objJSON.status !== 1) {
        throw new Error("操作失败，原因：" + objJSON.message);
      }
    } catch (e) {}
    return {};
  }
}
exports({ entryPoint: MyTrigger });