let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var context = AppContext();
    var jsonContext = JSON.parse(context);
    var token = jsonContext.token;
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      Cookie: "yht_access_token=" + token
    };
    var strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), "");
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });