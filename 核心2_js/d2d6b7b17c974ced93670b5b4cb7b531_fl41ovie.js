let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return {};
  }
}
exports({ entryPoint: MyTrigger });
let body = { key: "yourkeyHere" };
let url = "https://www.example.com/";
let apiResponse = openLinker("POST", url, "AppCode", JSON.stringify(body));
address;