let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取Tenant_id
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    // 检测需要访问的URL地址
    let hostUrl = "https://www.example.com/";
    if (tid == "ykrrxl7u") {
      hostUrl = "https://www.example.com/";
    }
    let locationId = request.locationId;
    var strResponse = postman("get", hostUrl + "/location/GetLocationNumByParentId?locationId=" + locationId + "&tenant_id=" + tid, null, null);
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });