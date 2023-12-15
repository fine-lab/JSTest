let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let responseObj = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(processStartMessage));
    return {};
  }
}
exports({ entryPoint: MyTrigger });