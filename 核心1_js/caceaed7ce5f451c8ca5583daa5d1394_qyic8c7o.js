let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const sql = "select id,confirmTime,Operator from AT16A11A2C17080008.AT16A11A2C17080008.custInfo";
    const res = ObjectStore.queryByYonQL(sql);
    const obj = [];
    // 日期方法
    Date.prototype.Format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours() + 8, //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      return fmt;
    };
    res.forEach((item) => {
      obj.push({
        id: item.id,
        confirmTime: new Date().Format("yyyy-MM-dd HH:mm:ss"),
        Operator: ObjectStore.user().name
      });
    });
    const resUpdate = ObjectStore.updateById("AT16A11A2C17080008.AT16A11A2C17080008.custInfo", obj, "33c548e9");
    return {
      resUpdate
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});