let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = request.code;
    //获取token
    let func1 = extrequire("GT80750AT4.backDefaultGroup.getToKen");
    var paramToken = {};
    let resToken = func1.execute(paramToken);
    var token = resToken.access_token;
    let data = { code: code };
    let body = { data: data };
    //查询客户自定义项信息
    let getCustomerDefineUrl = "https://www.example.com/";
    let Customers = postman("post", getCustomerDefineUrl + token, null, JSON.stringify(body));
    return { Customers };
  }
}
exports({ entryPoint: MyAPIHandler });