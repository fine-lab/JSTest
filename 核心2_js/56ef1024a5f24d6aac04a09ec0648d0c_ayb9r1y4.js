let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取页面上主子所有信息
    var data = param.data[0];
    // 获取主表的id
    var dataId = data.id;
    // 获取子表的集合
    var details = data.advanceInformationSheetDetailList;
    if (details == null) {
      return {};
    }
    // 获取每一条子表信息
    for (var i = 0; i < details.length; i++) {
      var detailOne = details[i];
      // 获取每一条子表的生产工号
      var productionNumber = detailOne.productionWorkNumber_productionWorkNumber;
      // 获取每一条子表的id
      var detailsId = detailOne.id;
      // 本次预支金额;
      var THISTIMEAMOUNT = detailOne.amountOfAdvanceThisTime;
      // 根据生产工号查询安装合同子表
      var sql = "select id from GT102917AT3.GT102917AT3.BasicInformationDetails where Productionworknumber = '" + productionNumber + "'";
      var BasicInformationDetailsRes = ObjectStore.queryByYonQL(sql, "developplatform");
      if (BasicInformationDetailsRes.length == 0) {
        // 安装组结算金额赋值为0
        var object = {
          id: dataId,
          _status: "Update",
          advanceInformationSheetDetailList: [{ id: detailsId, installationGroupAmount: 0, _status: "Update" }]
        };
        var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.advanceInformationSheet", object, "1e3ef2af");
      } else {
        // 获取安装合同子表id
        var id = BasicInformationDetailsRes[0].id;
        // 根据安装合同子表id查询任务下达单详情
        var taskOrdersql = "select * from GT102917AT3.GT102917AT3.Taskorderdetailss where shengchangonghao = '" + id + "'";
        var taskRes = ObjectStore.queryByYonQL(taskOrdersql, "developplatform");
        if (taskRes.length == 0) {
          // 安装组结算金额赋值为0
          var object = {
            id: dataId,
            _status: "Update",
            advanceInformationSheetDetailList: [{ id: detailsId, installationGroupAmount: 0, _status: "Update" }]
          };
          var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.advanceInformationSheet", object, "1e3ef2af");
        } else {
          var AMCOUNTCOUNT = 0;
          // 循环任务下达单详情信息
          for (var j = 0; j < taskRes.length; j++) {
            var taskResOne = taskRes[j];
            var amcount = taskResOne.anzhuangzujiesuanjin;
            if (amcount == undefined) {
              amcount = 0;
            }
            AMCOUNTCOUNT = AMCOUNTCOUNT + amcount;
          }
          // 安装组结算金额赋值为AMCOUNTCOUNT
          // 分包合同参照id
          var productionWorkNumber = detailOne.productionWorkNumber;
          var advanceSql = "select * from GT102917AT3.GT102917AT3.advanceInformationSheetDetail where productionWorkNumber='" + productionWorkNumber + "'";
          var advanceRes = ObjectStore.queryByYonQL(advanceSql, "developplatform");
          // 汇总已预支金额
          var ADVANCEAMOUNT = 0;
          for (var g = 0; g < advanceRes.length; g++) {
            var advanceOne = advanceRes[g];
            // 获取每条子表的本次预支金额
            var AdvanceAmount = advanceOne.amountOfAdvanceThisTime;
            if (AdvanceAmount == undefined) {
              AdvanceAmount = 0;
            }
            ADVANCEAMOUNT = ADVANCEAMOUNT + AdvanceAmount;
          }
          var AMOUNT = ADVANCEAMOUNT - THISTIMEAMOUNT;
          var object = {
            id: dataId,
            _status: "Update",
            advanceInformationSheetDetailList: [{ id: detailsId, installationGroupAmount: AMCOUNTCOUNT, amountAdvanced: AMOUNT, _status: "Update" }]
          };
          var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.advanceInformationSheet", object, "1e3ef2af");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });