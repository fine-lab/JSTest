let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //两个null应该怎么填
    //获取ID
    var productId = request.productId;
    var org = request.org;
    var requestBody = {
      product: productId,
      org: org
    };
    let func1 = extrequire("GT20314AT119.backDefaultGroup.getToken");
    let res = func1.execute();
    let apiResponse = postman("post", "https://www.example.com/" + res.access_token, null, JSON.stringify(requestBody));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });