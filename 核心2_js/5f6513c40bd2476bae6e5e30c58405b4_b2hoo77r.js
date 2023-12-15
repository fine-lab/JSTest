let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = request.delQuoteParam;
    let header = { "Content-Type": "application/json", Accept: "application/json" };
    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });