let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取当前系统时间
    var timezone = 8; //目标时区时间，东八区
    // 本地时间和格林威治的时间差，单位为分钟
    var offset_GMT = new Date().getTimezoneOffset();
    // 本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var nowDate = new Date().getTime();
    var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    // 获取id
    let data = JSON.parse(param.requestData);
    let productionValidity = data.production_validity;
    let IsEarlywarning = data.IsEarlywarning;
    let productionValidityDate = new Date(productionValidity).getTime();
    let NowDate = (productionValidityDate - date.getTime()) / (1000 * 3600 * 24);
    if (NowDate <= 30) {
      // 修改状态
      param.data[0].set("IsEarlywarning", "1");
    } else {
      // 修改状态
      param.data[0].set("IsEarlywarning", "2");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });