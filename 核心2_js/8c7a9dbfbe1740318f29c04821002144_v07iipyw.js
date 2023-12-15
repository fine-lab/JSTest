let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = { schemeName: "启用的客户", isDefault: false, "merchantAppliedDetail.stopstatus": false, pageIndex: 1, pageSize: 10 };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("GET", url, "25343be2c43b4e7e8b1f8e7bfda4fabd", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });