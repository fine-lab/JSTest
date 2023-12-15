let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = { context: context, param: param };
    let header = { key: "yourkeyHere" };
    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    return {};
  }
}
exports({ entryPoint: MyTrigger });