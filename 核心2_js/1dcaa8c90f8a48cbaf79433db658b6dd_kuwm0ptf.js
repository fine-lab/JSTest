let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT54451AT61.backDefaultGroup.getOpenToken");
    let res = func1.execute();
    var param = "刘红飞";
    var body = {
      name: "小张"
    };
    var strResponse = postman("post", "https://www.example.com/" + param + "?access_token=" + res.access_token, null, JSON.stringify(body));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });