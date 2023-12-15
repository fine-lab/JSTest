let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取生产工号
    var productionWorkNumber = request.productionWorkNumber;
    // 类型
    var advanceType = request.advanceType;
    var massage = "";
    if (advanceType == 1) {
      // 安装预支
      var sql = "select * from GT102917AT3.GT102917AT3.installBillingDetails where productionWorkNumber = '" + productionWorkNumber + " 'and dr =0";
      var res = ObjectStore.queryByYonQL(sql);
      if (res.length > 0) {
        massage = "该生产工号已经安装结算";
      }
    } else if (advanceType == 2) {
      // 吊装预支
      var sql = "select * from GT102917AT3.GT102917AT3.detailsOfLiftingStatement where productionWorkNumber = '" + productionWorkNumber + "' and dr =0";
      var res = ObjectStore.queryByYonQL(sql);
      if (res.length > 0) {
        massage = "该生产工号已经吊装结算";
      }
    } else if (advanceType == 3) {
      // 搭棚预支
      var sql = "select * from GT102917AT3.GT102917AT3.shedSettlementStatementDetail where productionWorkNumber = '" + productionWorkNumber + "' and dr =0";
      var res = ObjectStore.queryByYonQL(sql);
      if (res.length > 0) {
        massage = "该生产工号已经搭棚结算";
      }
    }
    return { massage };
  }
}
exports({ entryPoint: MyAPIHandler });