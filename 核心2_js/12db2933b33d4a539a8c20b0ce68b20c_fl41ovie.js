let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = UrlEncode("https://www.baidu.com/s?ie=UTF-8&wd=用友");
    return res;
  }
}
exports({ entryPoint: MyTrigger });