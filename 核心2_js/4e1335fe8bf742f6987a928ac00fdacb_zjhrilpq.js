let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let header = {
      appkey: "yourkeyHere",
      appsecret: "yoursecretHere"
    };
    let body = { schemeName: "启用的客户", isDefault: false, "merchantAppliedDetail.stopstatus": false, pageIndex: 1, pageSize: 10 };
    let url = "https://www.example.com/";
    let apiResponse = ublinker("POST", url, JSON.stringify(header), JSON.stringify(body));
    return {};
  }
}
exports({ entryPoint: MyTrigger });