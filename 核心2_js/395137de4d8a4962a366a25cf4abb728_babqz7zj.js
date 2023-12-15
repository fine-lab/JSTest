let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/";
    var strResponse = postman("get", url, null, JSON.stringify({}));
    throw new Error(strResponse);
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });