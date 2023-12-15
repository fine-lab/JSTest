let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 时间格式化方法
    var dateFormat = function (date, format) {
      date = new Date(date);
      var o = {
        "M+": date.getMonth() + 1, //month
        "d+": date.getDate(), //day
        "H+": date.getHours() + 8, //hour+8小时
        "m+": date.getMinutes(), //minute
        "s+": date.getSeconds(), //second
        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
        S: date.getMilliseconds() //millisecond
      };
      if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      return format;
    };
    var obj = param.data[0]; // 当前对象
    var id = obj.id; // 当前单据id
    // 更新条件
    var updateWrapper = new Wrapper();
    updateWrapper.eq("SY01_suspensionsonFk", id);
    // 更新内容  更新停售状态， 停售时间
    var tmp = { isStopSelling: "1", _status: "Update", stopSellDate: dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss") };
    var res = ObjectStore.update("GT22176AT10.GT22176AT10.SY01_suspensionson", tmp, updateWrapper, "82ecba4c");
    return {};
  }
}
exports({ entryPoint: MyTrigger });