let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = { schemeName: "启用的客户", isDefault: false, "merchantAppliedDetail.stopstatus": false, pageIndex: 1, pageSize: 10 };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "PU", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });