let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ids = request.ids;
    let code = request.code;
    let func1 = extrequire("GT80266AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(null);
    var token = res.access_token;
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
    let body = {
      data: ids
    };
    let getsdUrl = "https://www.example.com/" + token;
    var apiResponse = postman("POST", getsdUrl, JSON.stringify(header), JSON.stringify(body));
    let apiResponseJson = JSON.parse(apiResponse);
    let result = {
      code: apiResponseJson.code,
      message: code + "_" + apiResponseJson.message
    };
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });