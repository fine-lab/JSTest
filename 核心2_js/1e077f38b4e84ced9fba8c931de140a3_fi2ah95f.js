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
    if (data.yuliuziduan9 != 0) {
      //虚惊事件加分
      var kf = 5;
      var deptId = data.yuliuziduan7;
      var object = {
        floatIntergal: kf,
        deptId: deptId
      };
      var header = {
        "Content-Type": "application/json"
      };
      let func1 = extrequire("GT37722AT28.backDefaultGroup.getToken");
      let res = func1.execute();
      var strResponse = postman(
        "post",
        "https://www.example.com/" + "?access_token=" + res.access_token,
        JSON.stringify(header),
        JSON.stringify(object)
      );
    } else if (data.yuliuziduan10 != 0) {
      //修改字段11为当前时间,文本形式
      var obj = { id: data.id, yuliuziduan12: new Date().getTime() + "" };
      var res = ObjectStore.updateById("GT37722AT28.GT37722AT28.abnormal_event", obj, "58255e4e");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });