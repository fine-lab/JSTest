let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //月初
    var formatDate = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      return y + "-" + m;
    };
    //月末
    var formatDate2 = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 2;
      m = m < 10 ? "0" + m : m;
      if (m == 13) {
        y++;
        m = 1;
      }
      return y + "-" + m;
    };
    var lastdate = formatDate(new Date(Date.parse(request.suoshuhuijiqijian)));
    var nextdate = formatDate2(new Date(Date.parse(request.suoshuhuijiqijian)));
    var res = ObjectStore.queryByYonQL("select * from GT1745AT3.GT1745AT3.YSYF01 where jiaoyiriqi>='" + lastdate + "' and jiaoyiriqi<'" + nextdate + "'");
    return { res: res };
  }
}
exports({ entryPoint: MyAPIHandler });