let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const params = request.params;
    let body = { orgId: params.id };
    let header = { "Content-Type": "application/json;charset=UTF-8" };
    const serviceUrl = "https://www.example.com/";
    const url = serviceUrl + "/rc/api/org";
    let responseObj = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    throw new Error(responseObj);
    return { responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });