let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let body = { contnum: request.contnum }; //http://123.139.215.206:2108/service/operDataMethod?dataType=continfo
    let apiResponse = postman("post", "http://222.90.97.2:2105/service/operod?dataType=continfo1", JSON.stringify(header), JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });