let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = request;
    let header = { key: "yourkeyHere" };
    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });