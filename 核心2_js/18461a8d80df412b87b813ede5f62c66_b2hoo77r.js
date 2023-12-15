let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let secretKey = "yourKeyHere";
    let tokenUrl = "https://www.example.com/" + secretKey;
    let header = { Accept: "application/json" };
    let strResponse = postman("get", tokenUrl, JSON.stringify(header), null);
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });