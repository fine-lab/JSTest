let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var ak = request.zhangbuID;
    var pd = request.kuaijiqijian;
    var token = request.newToken;
    var url = "https://www.example.com/" + token;
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var body = {
      accbook: "",
      period: ""
    };
    body.accbook = ak;
    body.period = pd;
    let apiResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });