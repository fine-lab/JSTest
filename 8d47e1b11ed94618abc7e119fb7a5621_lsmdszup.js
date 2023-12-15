let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let method = "GET";
    let url = "https://www.example.com/";
    let header = { "Content-Type": "application/json;charset=utf-8" };
    let body = {
      grant_type: "client_credential",
      appid: "youridHere",
      secret: "yoursecretHere"
    };
    var strResponse = postman(method, url, "form", JSON.stringify(header), JSON.stringify(body));
    var result = JSON.parse(strResponse);
    return { apiResponse: apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });