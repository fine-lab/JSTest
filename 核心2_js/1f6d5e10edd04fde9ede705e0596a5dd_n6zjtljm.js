let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.data;
    let base_path_openapi = "https://www.example.com/";
    //拿到access_token
    let funcxn = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
    let resxn = funcxn.execute("");
    var token1 = resxn.access_token;
    //通过订单id获取整单信息
    let apiResponse = postman("get", base_path_openapi.concat("?access_token=" + token1 + "&id=" + id + "&productApplyRangeId=666666"));
    let obj = JSON.parse(apiResponse);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });