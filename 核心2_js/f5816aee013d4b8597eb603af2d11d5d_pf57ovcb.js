let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let body = context;
    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    return {};
  }
}
exports({ entryPoint: MyTrigger });