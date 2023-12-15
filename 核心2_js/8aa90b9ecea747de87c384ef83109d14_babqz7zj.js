let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var productId = request.productId;
    var requestBody = {
      product: productId
    };
    let func1 = extrequire("GT40095AT224.backDefaultGroup.getToken");
    let res = func1.execute();
    let apiResponse = postman("post", "https://www.example.com/" + res.access_token, null, JSON.stringify(requestBody));
    return { apiResponse: apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });