let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    const requestUrl = "http://119.3.52.76/test";
    const header = {
      "Content-Type": "application/json"
    };
    var strResponse = postman("GET", requestUrl, JSON.stringify(header), null);
    //获取token
    var responseObj = JSON.parse(strResponse);
    return { responseObj };
  }
}
exports({ entryPoint: MyTrigger });