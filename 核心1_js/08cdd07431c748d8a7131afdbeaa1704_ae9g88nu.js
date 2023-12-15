let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let audittype = request.audittype;
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
    // 更新条件
    var updateWrapper = new Wrapper();
    updateWrapper.eq("SY01_suspensionsonFk", id);
    if (audittype == "0") {
      var tmp0 = { isStopSelling: "1", _status: "Update", stopSellDate: dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss") };
      var res0 = ObjectStore.update("GT22176AT10.GT22176AT10.SY01_suspensionson", tmp0, updateWrapper, "82ecba4c");
    } else {
      var tmp1 = { isStopSelling: "0", _status: "Update", stopSellDate: "" };
      var res1 = ObjectStore.update("GT22176AT10.GT22176AT10.SY01_suspensionson", tmp1, updateWrapper, "82ecba4c");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });