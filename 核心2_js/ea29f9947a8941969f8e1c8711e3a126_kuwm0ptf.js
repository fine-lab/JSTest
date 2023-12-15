let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {};
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "SACT", JSON.stringify(body));
    return {};
  }
}
exports({ entryPoint: MyTrigger });