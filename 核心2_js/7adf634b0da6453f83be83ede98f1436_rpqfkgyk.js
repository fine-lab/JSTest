let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var strResponse = postman("get", "http://baike.baidu.com/api/openapi/BaikeLemmaCardApi?scope=103&format=json&appid=379020&bk_key=关键字&bk_length=600", null, null);
    throw new Error(strResponse);
    return {};
  }
}
exports({ entryPoint: MyTrigger });