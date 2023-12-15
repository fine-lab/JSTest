let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 定义要返回的计算公式
    let formula = null;
    // 定义要返回的本次预支金额
    let theTimeMoney = 0;
    // 定义合计金额
    let addAmount = 0;
    var productionWorkNumber = request.productionWorkNumber;
    var productionWorkNumberId = request.productionWorkNumberId;
    var type = request.type;
    // 询预支信息表子表
    var advanceSql =
      "select advanceInformationSheet_id.advanceType,amountOfAdvanceThisTime from GT102917AT3.GT102917AT3.advanceInformationSheetDetail where productionWorkNumber='" + productionWorkNumberId + "'";
    var advanceRes = ObjectStore.queryByYonQL(advanceSql, "developplatform");
    if (advanceRes.length == 0) {
    } else {
      for (var j = 0; j < advanceRes.length; j++) {
        // 获取每条子表的本次预支金额
        var advanceOne = advanceRes[j];
        var advanType = advanceOne.advanceInformationSheet_id_advanceType;
        if (advanType == type) {
          var amcount = advanceOne.amountOfAdvanceThisTime;
          if (amcount == undefined) {
            amcount = 0;
          }
          theTimeMoney = theTimeMoney + amcount;
        }
      }
    }
    // 根据生产工号查询安装合同子表
    var sql = "select id from GT102917AT3.GT102917AT3.BasicInformationDetails where Productionworknumber = '" + productionWorkNumber + "'";
    var BasicInformationDetailsRes = ObjectStore.queryByYonQL(sql, "developplatform");
    if (BasicInformationDetailsRes.length == 0) {
      return { formula: " ", theTimeMoney: theTimeMoney };
    } else {
      // 获取安装合同子表id
      var id = BasicInformationDetailsRes[0].id;
      // 根据安装合同子表id查询任务下达单详情
      var taskOrdersql = "select * from GT102917AT3.GT102917AT3.Taskorderdetailss where shengchangonghao = '" + id + "'";
      var taskRes = ObjectStore.queryByYonQL(taskOrdersql, "developplatform");
      if (taskRes.length == 0) {
        return { formula: " ", addAmount: addAmount, theTimeMoney: theTimeMoney };
      } else {
        // 计算公式
        formula = taskRes[0].jisuangongshi;
        // 结算金额
        addAmount = taskRes[0].anzhuangzujiesuanjin;
      }
      return { formula: formula, addAmount: addAmount, theTimeMoney: theTimeMoney };
    }
  }
}
exports({ entryPoint: MyAPIHandler });