let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {};
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "GT89199AT40", JSON.stringify(body));
    return { apiResponse };
    return {};
  }
}
exports({ entryPoint: MyTrigger });