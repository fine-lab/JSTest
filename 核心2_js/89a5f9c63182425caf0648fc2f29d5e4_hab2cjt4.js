let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    Date.prototype.Format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
      }
      return fmt;
    };
    var data = param.data[0];
    if (data.yuliuziduan10 == true && data.yuliuziduan12 == undefined) {
      //修改字段12为当前时间,文本形式
      var obj = { id: data.id, yuliuziduan12: new Date().getTime() + "" };
      var res = ObjectStore.updateById("GT43085AT4.GT43085AT4.abnormal_event", obj, "4743363b");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });