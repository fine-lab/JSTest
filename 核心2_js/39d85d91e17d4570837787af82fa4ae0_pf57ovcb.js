let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let responseObj = postman("get", "https://www.example.com/", JSON.stringify(header));
    return { responseObj };
  }
}
exports({ entryPoint: MyTrigger });