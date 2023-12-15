let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let header = { appkey: "yourkeyHere", appsecret: "yoursecretHere" };
    let body = {
      code: "CNY",
      name: "人民币",
      pageIndex: "1",
      pageSize: "10"
    };
    let url = "https://www.example.com/";
    let apiResponse = ublinker("POST", url, JSON.stringify(header), JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });