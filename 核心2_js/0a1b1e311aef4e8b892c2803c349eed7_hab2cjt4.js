let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    Date.prototype.Format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      return fmt;
    };
    var time = new Date().Format("yyyy-MM-dd HH:mm:ss");
    var object = { call_num: request.call_num, name: request.name };
    var object1 = { score: request.score };
    var res = ObjectStore.selectByMap("GT42921AT2.GT42921AT2.buildma_info", object);
    var res1 = object;
    var object = res[0];
    object["score"] = request.score;
    object["examTimeCost"] = request.costTime;
    object["completeDate"] = request.time;
    var res = ObjectStore.insert("GT42921AT2.GT42921AT2.BuildersGrade", object, "952a8410");
    return { res, res1, object };
  }
}
exports({ entryPoint: MyAPIHandler });