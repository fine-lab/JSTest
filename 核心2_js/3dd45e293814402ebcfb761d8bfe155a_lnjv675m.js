let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let header = { cookie: "DMWayRequest=defaultway" };
    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), "测试！！！");
    return {};
  }
}
exports({ entryPoint: MyTrigger });