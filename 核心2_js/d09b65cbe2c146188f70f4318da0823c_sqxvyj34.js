let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let header = { appkey: "yourkeyHere", appsecret: "yoursecretHere" };
    let body = {};
    let url = "https://www.example.com/";
    let apiResponse = ublinker("POST", url, JSON.stringify(header), JSON.stringify(body));
    return apiResponse;
  }
}
exports({ entryPoint: MyTrigger });