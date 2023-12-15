let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 构建请求Body体
    const reqBodyObj = request.reqBodyObj;
    const header = {
      "Content-Type": "application/json; charset=UTF-8"
    };
    var strResponse = postman("POST", "http://123.57.144.10:9001/EStartSignAPI/ESignPost", JSON.stringify(header), JSON.stringify(reqBodyObj));
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });