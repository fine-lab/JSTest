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
      return y + "-" + m;
    };
    var res = ObjectStore.queryByYonQL("select * from GT2054AT4.GT2054AT4.XMLZ01 where ziduan7>='" + formatDate(new Date()) + "' and ziduan7<'" + formatDate2(new Date()) + "' ");
    return { res: res };
  }
}
exports({ entryPoint: MyAPIHandler });