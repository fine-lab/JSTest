let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let url = "https://www.example.com/";
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      // 就是appCode
      Authorization: "Bearer SlOGnl1vjjdngNsqg0b9YmRt36yuIPfD"
    };
    let body = {
      app_id: "youridHere",
      entry_id: "youridHere",
      limit: 100
    };
    let apiResponse = apiman("post", url, JSON.stringify(header), JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });