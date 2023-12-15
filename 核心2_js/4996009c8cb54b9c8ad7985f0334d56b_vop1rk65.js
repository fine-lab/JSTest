let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let header = { appkey: "yourkeyHere", appsecret: "yoursecretHere" };
    let body = {
      code: request.currency, // "CNY",
      pageIndex: "1",
      pageSize: "10"
    };
    let url = "https://www.example.com/";
    let apiResponse = ublinker("POST", url, JSON.stringify(header), JSON.stringify(body));
    let result = { apiResponse };
    var obj = JSON.parse(result.apiResponse);
    request.currency = obj.data.recordList[0].id;
    var res = ObjectStore.insert("GT20649AT9.GT20649AT9.codeToIdTest", request, "6285f568");
    return res;
  }
}
exports({ entryPoint: MyAPIHandler });