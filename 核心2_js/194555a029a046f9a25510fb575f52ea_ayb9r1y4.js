let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var contractNo = param.data[0].contractNumber_subcontractNo;
    if (param.requestData._status == null) {
      var ddd = JSON.parse(param.requestData);
    } else {
      var ddd = param.requestData;
    }
    // 查询分包合同主表
    var sql1 = "select id from GT102917AT3.GT102917AT3.subcontract where subcontractNo = '" + contractNo + "'";
    var res1 = ObjectStore.queryByYonQL(sql1);
    // 获取分包合同主表id
    contractNo = res1[0].id;
    // 获取导入时的页面状态
    var state = ddd._status;
    //根据主表id查询分包合同下的生产工号
    var sql = "select productionWorkNumber,id,hoistingWhether from GT102917AT3.GT102917AT3.subcontractDetails where subcontract_id = '" + contractNo + "'";
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0 && param.data[0].hasOwnProperty("detailsOfLiftingStatementList") != false) {
      //获取新增生产工号
      if (param.data[0].detailsOfLiftingStatementList != null) {
        for (var i = 0; i < param.data[0].detailsOfLiftingStatementList.length; i++) {
          var sum = 0;
          for (var j = 0; j < res.length; j++) {
            if (res[j].hoistingWhether == 1 && res[j].productionWorkNumber == param.data[0].detailsOfLiftingStatementList[i].productionWorkNumber_productionWorkNumber) {
              throw new Error("生产工号" + param.data[0].detailsOfLiftingStatementList[i].productionWorkNumber_productionWorkNumber + "已结算");
            }
            if (
              res[j].productionWorkNumber == param.data[0].detailsOfLiftingStatementList[i].productionWorkNumber_productionWorkNumber ||
              param.data[0].detailsOfLiftingStatementList[i].productionWorkNumber_productionWorkNumber == null
            ) {
              sum = sum + 1;
            }
          }
          if (sum == 0) {
            throw new Error("生产工号" + param.data[0].detailsOfLiftingStatementList[i].productionWorkNumber_productionWorkNumber + "不存在于合同中");
          }
        }
      }
    }
    //根据主表id查询吊装结算表子表的生产工号
    var sql2 = "select productionWorkNumber from GT102917AT3.GT102917AT3.detailsOfLiftingStatement";
    var res2 = ObjectStore.queryByYonQL(sql2);
    // 判断导入时的页面状态
    if (state == "Insert" && param.data[0].detailsOfLiftingStatementList != null) {
      for (var m = 0; m < param.data[0].detailsOfLiftingStatementList.length; m++) {
        var sum1 = 0;
        for (var n = 0; n < res2.length; n++) {
          //根据生产工号查询分包合同子表id
          if (param.data[0].detailsOfLiftingStatementList[m].productionWorkNumber_productionWorkNumber != null) {
            var sql3 =
              "select id from GT102917AT3.GT102917AT3.subcontractDetails where productionWorkNumber = '" +
              param.data[0].detailsOfLiftingStatementList[m].productionWorkNumber_productionWorkNumber +
              "'and subcontract_id = '" +
              contractNo +
              "'";
            var res3 = ObjectStore.queryByYonQL(sql3);
            if (res3[0].id == res2[n].productionWorkNumber && param.data[0].detailsOfLiftingStatementList[m]._status == "Insert") {
              sum1 = sum1 + 1;
            }
          }
        }
        if (sum1 > 0) {
          throw new Error("生产工号" + param.data[0].detailsOfLiftingStatementList[m].productionWorkNumber_productionWorkNumber + "已结算");
        }
      }
    } else {
      if (param.data[0].hasOwnProperty("detailsOfLiftingStatementList")) {
        // 判断现在的页面状态
        if (state == "Update" && param.data[0].detailsOfLiftingStatementList != null) {
          for (var m = 0; m < param.data[0].detailsOfLiftingStatementList.length; m++) {
            var sum1 = 0;
            for (var n = 0; n < res2.length; n++) {
              //根据生产工号查询分包合同子表id
              if (param.data[0].detailsOfLiftingStatementList[m].productionWorkNumber_productionWorkNumber != null) {
                var sql3 =
                  "select id from GT102917AT3.GT102917AT3.subcontractDetails where productionWorkNumber = '" +
                  param.data[0].detailsOfLiftingStatementList[m].productionWorkNumber_productionWorkNumber +
                  "'and subcontract_id = '" +
                  contractNo +
                  "'";
                var res3 = ObjectStore.queryByYonQL(sql3);
                if (res3[0].id == res2[n].productionWorkNumber && param.data[0].detailsOfLiftingStatementList[m]._status != "Delete") {
                  sum1 = sum1 + 1;
                }
              }
            }
            if (sum1 > 1) {
              throw new Error("生产工号" + param.data[0].detailsOfLiftingStatementList[m].productionWorkNumber_productionWorkNumber + "已结算");
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });