let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    let base_path_openapi = "https://www.example.com/";
    //拿到access_token
    let funcxn = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
    let resxn = funcxn.execute("");
    var token1 = resxn.access_token;
    //通过订单id获取整单信息
    let apiResponse = postman("get", base_path_openapi.concat("?access_token=" + token1 + "&id=" + id));
    let obj = JSON.parse(apiResponse);
    let orderDetails = obj.data.orderDetails;
    var istocrm = "N";
    for (let i = 0; i < orderDetails.length; i++) {
      var bodyItem = orderDetails[i].bodyItem;
      if (typeof bodyItem !== "undefined") {
        if (bodyItem.define26 == "Y") {
          istocrm = "Y";
          break;
        }
      }
    }
    return { istocrm: istocrm };
  }
}
exports({ entryPoint: MyAPIHandler });