let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(param) {
    const body = JSON.stringify(param);
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    var strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), body);
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });