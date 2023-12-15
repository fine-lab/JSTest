let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var code = request.code;
    let data = {
      code: code
    };
    let url = "https://www.example.com/";
    let apiResponse = postman("POST", url, null, JSON.stringify(data));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });