let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let strs = request.submitBody;
    let token = request.zbyToken;
    let url = "https://www.example.com/";
    let header = { "Content-Type": "application/json;charset=UTF-8", Authorization: "Bearer " + token };
    let apiResponse = postman("post", url, JSON.stringify(header), JSON.stringify(strs));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });