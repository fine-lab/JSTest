let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取生产工号
    var SCNO = request.SCNO;
    //设置预支类型为附加
    var advanceType = 3;
    //获取合同号id
    var HTNumber = request.HTNumber;
    //根据合同号id和预支类型查出相同合同号下预支类型为吊装的所有id
    var sql = "select id from GT102917AT3.GT102917AT3.advanceInformationSheet where advanceType = '" + advanceType + "' and contractNumber = '" + HTNumber + "' ";
    var res = ObjectStore.queryByYonQL(sql);
    var sum = 0;
    //循环累加
    for (var i = 0; i < res.length; i++) {
      //根据查出来的id和生产工号查出数据
      var sql1 =
        "select amountOfAdvanceThisTime from GT102917AT3.GT102917AT3.advanceInformationSheetDetail where productionWorkNumber = '" + SCNO + "' and advanceInformationSheet_id = '" + res[i].id + "'";
      var ss = ObjectStore.queryByYonQL(sql1);
      if (ss.length > 0) {
        var ww = ss[0].amountOfAdvanceThisTime;
        sum = ww + sum;
      }
    }
    return { sum };
  }
}
exports({ entryPoint: MyAPIHandler });