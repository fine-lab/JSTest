let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let separate = "--"; //默认分隔符
    if (param != undefined && param.length > 0) {
      separate = param;
    }
    let dtNow = context;
    let sNowYear = dtNow.getFullYear().toString();
    let sNowMonth = (dtNow.getMonth() + 1).toString();
    sNowMonth = sNowMonth.length < 2 ? "0" + sNowMonth : sNowMonth;
    let sNowDay = dtNow.getDate().toString();
    sNowDay = sNowDay.length < 2 ? "0" + sNowDay : sNowDay;
    let sNowFmt = sNowYear + separate.substr(0, 1) + sNowMonth + separate.substr(1, 1) + sNowDay + separate.substr(2, 1);
    return sNowFmt;
  }
}
exports({
  entryPoint: MyTrigger
});