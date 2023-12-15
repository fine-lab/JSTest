let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {};
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT189A50D009080006", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });