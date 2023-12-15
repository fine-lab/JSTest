let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
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
    var object = { call_num: "+86-" + "18852931327", name: "付博文" };
    var res = ObjectStore.selectByMap("GT42921AT2.GT42921AT2.buildma_info", object);
    var res1 = object;
    var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
    var object = res[0];
    object["score"] = 80;
    object["examTimeCost"] = "0:10:10";
    object["completeDate"] = time;
    var res = ObjectStore.insert("GT42921AT2.GT42921AT2.BuildersGrade", object, "952a8410");
    var str = JSON.stringify(res);
    throw new Error(str);
    return { res, res1, object };
  }
}
exports({ entryPoint: MyTrigger });