let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = { key: "yourkeyHere" };
    let header = { key: "yourkeyHere" };
    let apiResponse = apiman("get", "https://www.baidu.com", JSON.stringify(header), JSON.stringify(body));
    return { result: apiResponse };
  }
}
exports({ entryPoint: MyTrigger });