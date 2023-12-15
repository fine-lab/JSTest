let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let type = request.type;
    let typeClass = request.typeClass;
    let info = request.info;
    //设置时间带时分秒
    var formatDateTime = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var ss = date.getSeconds() < 10 ? "0" + date.getSeonds() : date.getSeconds();
      return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    };
    var object = { new1: type, new2: typeClass, new3: formatDateTime(new Date()), new8: info };
    var res = ObjectStore.insert("GT1431AT3.GT1431AT3.yfklogtest", object, "b3b92b9d");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });