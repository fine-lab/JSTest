let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = { key: "yourkeyHere" };
    let header = { key: "yourkeyHere" };
    let strResponse = postman("get", "http://39.106.84.51:8001/testapi.do");
    return { strResponse };
  }
}
exports({ entryPoint: MyTrigger });