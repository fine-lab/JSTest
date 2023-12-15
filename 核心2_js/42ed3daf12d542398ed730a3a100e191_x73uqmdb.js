let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    if (request.productId == undefined) throw new Error("产品ID不能为空");
    let url = "https://www.example.com/" + request.productId;
    let body = { tenantId: request.tenantId, orderId: "yourIdHere" + uuid() };
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    let apiResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    return { request: body, reponse: apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });