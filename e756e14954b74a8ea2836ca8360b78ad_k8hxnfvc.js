let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //传入参数
    let body = [{ aid: 26583, invalid: 0 }];
    //调用pm接口
    let strResponse = postman("post", "https://www.example.com/", null, JSON.stringify(body));
    return { strResponse };
  }
}
exports({ entryPoint: MyTrigger });