let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let header = {
      "Accept-Encoding": "gzip, deflate, br",
      Accept: "*/*",
      "Content-Type": "text/html; charset=utf-8"
    };
    let responseObj = postman("get", "https://www.example.com/", JSON.stringify(header), null);
    return {
      responseObj
    };
  }
}
exports({ entryPoint: MyAPIHandler });