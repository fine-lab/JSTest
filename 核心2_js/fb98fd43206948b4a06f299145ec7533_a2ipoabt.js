let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var strs = request.submitBody;
    var token = request.zbyToken;
    var url = "https://www.example.com/";
    var header = { "Content-Type": "application/json;charset=UTF-8", Authorization: "Bearer " + token };
    let apiResponse = postman("post", url, JSON.stringify(header), JSON.stringify(strs));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });