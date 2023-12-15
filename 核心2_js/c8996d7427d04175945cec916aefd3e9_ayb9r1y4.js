let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //生产工号
    var id = request.number;
    //合同号
    var hth = request.Hth;
    // 类型
    var advanceType = 1;
    //查询预支信息表
    var sql = "select id from GT102917AT3.GT102917AT3.advanceInformationSheet where contractNumber ='" + hth + "' and advanceType='" + advanceType + "'";
    var sql1 = ObjectStore.queryByYonQL(sql);
    // 定义新变量
    var count = 0;
    for (var i = 0; i < sql1.length; i++) {
      //获取主表id
      var pid = sql1[i].id;
      var sql3 = "select amountOfAdvanceThisTime from GT102917AT3.GT102917AT3.Taskorderdetails where shengchangonghao ='" + id + "' and id='" + pid + "'";
      var result = ObjectStore.queryByYonQL(sql3);
      for (var l = 0; l < result.length; l++) {
        count += result[l].amountOfAdvanceThisTime;
      }
    }
    return { count };
  }
}
exports({ entryPoint: MyAPIHandler });