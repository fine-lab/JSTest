let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var timezone = 8; //目标时区时间，东八区
    // 本地时间和格林威治的时间差，单位为分钟
    var offset_GMT = new Date().getTimezoneOffset();
    // 本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var nowDate = new Date().getTime();
    var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    var nowdateTime = date.getTime();
    var beforeDate = new Date(date);
    beforeDate.setDate(date.getDate() - 30);
    var agoDay = `${beforeDate.getFullYear()}-${beforeDate.getMonth() + 1 < 10 ? `0${beforeDate.getMonth() + 1}` : beforeDate.getMonth() + 1}-${beforeDate.getDate()}`;
    //当前日期
    var nowDay = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate()}`;
    var sql =
      "select product_coding,id, registration_certificate_effective_date from AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation where registration_certificate_effective_date >= '" +
      agoDay +
      "' and registration_certificate_effective_date <='" +
      nowDay +
      "'";
    var res = ObjectStore.queryByYonQL(sql);
    throw new Error(JSON.stringify(res.length));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });