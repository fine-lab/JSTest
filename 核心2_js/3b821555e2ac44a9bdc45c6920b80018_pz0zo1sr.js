let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let Authorization = {
      Authorization: "Basic cmZjZ3lzOjY1NDMyMWE=",
      apikey: "yourkeyHere"
    };
    // 正式环境
    // 测试环境
    let url = context != undefined ? context : "https://www.example.com/";
    var strResponse = postman("post", url, JSON.stringify(Authorization), JSON.stringify(param));
    return { strResponse };
  }
}
exports({ entryPoint: MyTrigger });