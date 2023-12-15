let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    function GetNumberOfDays(date1, date2) {
      //获得天数
      var a1 = Date.parse(new Date(date1));
      var a2 = Date.parse(new Date(date2));
      var day = parseInt((a2 - a1) / (1000 * 60 * 60 * 24)); //核心：时间戳相减，然后除以天数
      return day;
    }
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
    var str = JSON.stringify(param.data);
    const value = param.data[0].trainDate;
    const trainType = param.data[0].trainType;
    const date = new Date(value);
    const days = date.getDay();
    var a1 = new Date().Format("yyyy-MM-dd");
    var a2 = value;
    var b = GetNumberOfDays(a1, a2);
    if (b < 0) {
      throw new Error("选择的这个时间的培训已结束");
    }
    if (trainType == "1") {
      if (b > 7) {
        throw new Error("长期入厂最多提前7天报名");
      }
      if (days != 2 && days != 5) {
        throw new Error("长期入厂培训时间为每周二、周五");
      }
    } else if (trainType == "2" || trainType == "3") {
      if (b > 3) {
        throw new Error("临时入厂和紧急入厂最多提前3天报名");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });