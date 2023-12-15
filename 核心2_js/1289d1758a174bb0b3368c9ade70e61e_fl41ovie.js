//银行卡实名认证接口
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var header = {
      authoration: "apicode",
      apicode: "024e5854d4894703957902bde302c67a",
      "Content-Type": "application/json"
    };
    var body = {
      idNumber: request.idNumber,
      userName: request.userName,
      cardNo: request.cardNo
    };
    header = JSON.stringify(header);
    body = JSON.stringify(body);
    var strResponse = postman("post", "https://www.example.com/", header, body);
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });