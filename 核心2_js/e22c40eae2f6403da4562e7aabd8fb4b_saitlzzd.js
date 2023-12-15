let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取物料的Id;
    var id = request.sku.pro_id;
    var orgId = request.sku.org_id;
    let ContentType = "application/json;charset=UTF-8";
    let header = { "Content-Type": ContentType };
    //加载获取token的公共函数
    let func1 = extrequire("GT5646AT1.apifunction.getToken");
    let res = func1.execute(null, null);
    let access_token = res.access_token;
    let url = "https://www.example.com/" + access_token + "&id=" + id + "&orgId=" + orgId;
    let apiResponse = postman("GET", url, JSON.stringify(header), null);
    var resultStr = JSON.parse(apiResponse);
    return { resultStr };
  }
}
exports({ entryPoint: MyAPIHandler });