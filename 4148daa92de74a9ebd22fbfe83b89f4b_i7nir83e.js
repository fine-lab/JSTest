let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = { key: "yourkeyHere" };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT18D1050017C80003", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });