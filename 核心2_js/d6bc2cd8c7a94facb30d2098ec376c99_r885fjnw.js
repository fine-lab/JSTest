let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/";
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      // 就是appCode
      Authorization: "Bearer SlOGnl1vjjdngNsqg0b9YmRt36yuIPfD",
      apicode: "e2b0ab62-8dfa-41a8-9520-bcc08efd1ecf",
      appkey: "yourkeyHere"
    };
    let body = {
      app_id: "youridHere",
      entry_id: "youridHere"
    };
    let apiResponse = apiman("post", url, JSON.stringify(header), JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });