let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取当前日期
    var now = new Date();
    var ss = now.getDate();
    var nowstr = now.getFullYear() + "-";
    if ((now.getMonth() + 1).length == 1) {
      nowstr = nowstr + "0" + (now.getMonth() + 1) + "-";
    } else {
      nowstr = nowstr + (now.getMonth() + 1) + "-";
    }
    if (now.getDate() < 10) {
      nowstr = nowstr + "0" + now.getDate();
    } else {
      nowstr = nowstr + now.getDate();
    }
    return { nowstr };
  }
}
exports({ entryPoint: MyTrigger });