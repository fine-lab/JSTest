let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取生产工号
    var SCNO1 = request.SCNO;
    //设置预支类型为附加
    var advanceType = 4;
    //获取合同号id
    var HTNumber1 = request.HTNumber;
    // 查询预支信息主表
    var sql = "select id,verifystate from GT102917AT3.GT102917AT3.advanceInformationSheet where contractNumber = '" + HTNumber1 + "' and advanceType = '" + advanceType + "'";
    var res1 = ObjectStore.queryByYonQL(sql);
    var res = 0;
    // 循环累加
    for (var i = 0; i < res1.length; i++) {
      //获取审批状态
      var verifystate = res1[i].verifystate;
      if (verifystate == 0 || verifystate == 1) {
        //根据查出来的id和生产工号查出数据，预支子表
        var sql1 =
          "select amountOfAdvanceThisTime from GT102917AT3.GT102917AT3.advanceInformationSheetDetail where productionWorkNumber = '" +
          SCNO1 +
          "' and advanceInformationSheet_id = '" +
          res1[i].id +
          "'";
        var ss = ObjectStore.queryByYonQL(sql1);
        for (var j = 0; j < ss.length; j++) {
          res = res + ss[j].amountOfAdvanceThisTime;
        }
      }
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });