let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var strResponse = postman("get", "https://www.example.com/", null, null);
    let resJson = eval("(" + strResponse + ")");
    if (resJson.code == "200") {
      return { resJson };
    } else {
      return { weather: "-" };
    }
  }
}
exports({ entryPoint: MyAPIHandler });