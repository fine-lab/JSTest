let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = { key: "yourkeyHere" };
    let header = {};
    let strResponse = postman("post", "https://127.0.0.1:38088/card=iccard", JSON.stringify(header), JSON.stringify(body));
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });