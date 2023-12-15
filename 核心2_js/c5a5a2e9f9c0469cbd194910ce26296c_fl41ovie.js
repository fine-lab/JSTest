//调实名认证接口
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var header = {
      authoration: "apicode",
      apicode: "ff5514a2831c40eaa17da2e212d948f7",
      "Content-Type": "application/json"
    };
    var body = {
      idNumber: request.idNumber,
      userName: request.userName,
      phoneNo: request.phoneNo
    };
    header = JSON.stringify(header);
    body = JSON.stringify(body);
    var strResponse = postman("post", "https://www.example.com/", header, body);
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });