let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(context, param) {
    let func1 = extrequire("GT80750AT4.backDefaultGroup.getToKen");
    var paramToken = {};
    let resToken = func1.execute(paramToken);
    var token = resToken.access_token;
    // 可以弹出具体的信息（类似前端函数的alert）
    //信息体
    let body = {};
    //信息头
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    // 可以直观的看到具体的错误信息
    let responseObj = postman("POST", "https://www.example.com/" + token, JSON.stringify(header), JSON.stringify(body));
    return {
      responseObj
    };
  }
}
exports({ entryPoint: MyAPIHandler });