let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data[0];
    var id = data.id;
    let base_path_openapi = "https://www.example.com/";
    //拿到access_token
    let funcxn = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
    let resxn = funcxn.execute("");
    var token1 = resxn.access_token;
    let apiResponse = postman("get", base_path_openapi.concat("?access_token=" + token1 + "&id=" + id));
    let obj = JSON.parse(apiResponse);
    if (obj.data.iSubmitSource == 3) {
      if (!obj.data.headItem || obj.data.headItem.define1 != "1") {
        throw new Error("订单客户未确认，不允许审核");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });