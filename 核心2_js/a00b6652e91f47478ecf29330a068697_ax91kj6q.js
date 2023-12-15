let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var ak = request.zhangbuID;
    var pd = request.kuaijiqijian;
    var url = "https://www.example.com/";
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var body = {
      accbook: "",
      period: ""
    };
    body.accbook = ak;
    body.period = pd;
    let apiResponse = openLinker("post", url, "GT15699AT1", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });