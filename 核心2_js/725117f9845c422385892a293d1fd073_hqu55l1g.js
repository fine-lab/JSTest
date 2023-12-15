let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = param;
    let func1 = extrequire("GT80266AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(null);
    var token = res.access_token;
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
    let url = "https://www.example.com/" + token;
    let apiResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    let apiResponsejson = JSON.parse(apiResponse);
    let result = {
      code: apiResponsejson.code,
      message: apiResponsejson.message
    };
    return { result };
  }
}
exports({ entryPoint: MyTrigger });