let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {};
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT182441A41648000B", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });