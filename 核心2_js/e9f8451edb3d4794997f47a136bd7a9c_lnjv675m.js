let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    let func1 = extrequire("GT34544AT7.common.getOpenApiToken");
    let res = func1.execute({});
    let apiResponse = postman("get", "https://www.example.com/" + res.access_token + "&id=" + id, null, null);
    apiResponse = JSON.parse(apiResponse);
    var org = apiResponse.data;
    res = org;
    return { res: res };
  }
}
exports({ entryPoint: MyAPIHandler });