let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取生产工号
    var SCN0 = request.SCN0;
    //获取预支类型
    var advanceType = request.advanceType;
    //获取合同号id
    var HTNumber = request.HTNumber;
    //根据合同号id和预支类型查出相同合同号下相同预支类型的所有id
    var sql = "select id from GT102917AT3.GT102917AT3.advanceInformationSheet where advanceType = '" + advanceType + "' and contractNumber = '" + HTNumber + "' ";
    var res1 = ObjectStore.queryByYonQL(sql);
    var res = 0;
    //循环累加
    for (var i = 0; i < res1.length; i++) {
      //根据查出来的id和生产工号查出数据
      var sql1 =
        "select amountOfAdvanceThisTime from GT102917AT3.GT102917AT3.advanceInformationSheetDetail where productionWorkNumber = '" + SCN0 + "' and advanceInformationSheet_id = '" + res1[i].id + "'";
      var ss = ObjectStore.queryByYonQL(sql1);
      if (ss.length > 0) {
        var ww = ss[0].amountOfAdvanceThisTime;
        res = ww + res;
      }
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });