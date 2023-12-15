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
    if (res1.length > 0) {
      contractNo = res1[0].id;
    }
    // 获取导入时的页面状态
    var state = ddd._status;
    //根据主表id查询分包合同下的生产工号
    var sql = "select productionWorkNumber,scaffoldWhether from GT102917AT3.GT102917AT3.subcontractDetails where subcontract_id = '" + contractNo + "'";
    var res = ObjectStore.queryByYonQL(sql);
    //获取新增生产工号
    if (param.data[0].shedSettlementStatementDetailList != null && param.data[0].hasOwnProperty("shedSettlementStatementDetailList") != null) {
      //获取生产工号是否搭棚结算
      for (var i = 0; i < param.data[0].shedSettlementStatementDetailList.length; i++) {
        var sum = 0;
        for (var j = 0; j < res.length; j++) {
          if (res[j].scaffoldWhether == 1 && res[j].productionWorkNumber == param.data[0].shedSettlementStatementDetailList[i].productionWorkNumber_productionWorkNumber) {
            throw new Error("生产工号" + param.data[0].shedSettlementStatementDetailList[i].productionWorkNumber_productionWorkNumber + "已结算");
          }
          if (
            res[j].productionWorkNumber == param.data[0].shedSettlementStatementDetailList[i].productionWorkNumber_productionWorkNumber ||
            param.data[0].shedSettlementStatementDetailList[i].productionWorkNumber_productionWorkNumber == null
          ) {
            sum = sum + 1;
          }
        }
        if (sum == 0) {
          throw new Error("生产工号" + param.data[0].shedSettlementStatementDetailList[i].productionWorkNumber_productionWorkNumber + "不存在于合同中");
        }
      }
    }
    //根据主表id查询搭棚结算表子表的生产工号
    var sql2 = "select * from GT102917AT3.GT102917AT3.shedSettlementStatementDetail";
    var res2 = ObjectStore.queryByYonQL(sql2);
    // 判断导入时的页面状态
    if (state == "Insert" && param.data[0].shedSettlementStatementDetailList != null) {
      for (var m = 0; m < param.data[0].shedSettlementStatementDetailList.length; m++) {
        var sum1 = 0;
        if (res2.length > 0) {
          for (var n = 0; n < res2.length; n++) {
            if (param.data[0].shedSettlementStatementDetailList[m].productionWorkNumber_productionWorkNumber != null) {
              //根据生产工号查询分包合同子表id
              var sql3 =
                "select id,productionWorkNumber from GT102917AT3.GT102917AT3.subcontractDetails where productionWorkNumber = '" +
                param.data[0].shedSettlementStatementDetailList[m].productionWorkNumber_productionWorkNumber +
                "'and subcontract_id = '" +
                contractNo +
                "'";
              var res3 = ObjectStore.queryByYonQL(sql3);
              if (res3[0].id == res2[n].productionWorkNumber && param.data[0].shedSettlementStatementDetailList[m]._status == "Insert") {
                sum1 = sum1 + 1;
              }
            }
          }
        }
        if (sum1 > 0) {
          throw new Error("生产工号" + param.data[0].shedSettlementStatementDetailList[m].productionWorkNumber_productionWorkNumber + "已结算");
        }
      }
    } else {
      // 判断现在的页面状态
      if (state == "Update" && param.data[0].shedSettlementStatementDetailList != null && param.data[0].hasOwnProperty("shedSettlementStatementDetailList") != false) {
        for (var m = 0; m < param.data[0].shedSettlementStatementDetailList.length; m++) {
          var sum1 = 0;
          for (var n = 0; n < res2.length; n++) {
            //根据生产工号查询分包合同子表id
            if (param.data[0].shedSettlementStatementDetailList[m].productionWorkNumber_productionWorkNumber != null) {
              var sql3 =
                "select id from GT102917AT3.GT102917AT3.subcontractDetails where productionWorkNumber = '" +
                param.data[0].shedSettlementStatementDetailList[m].productionWorkNumber_productionWorkNumber +
                "'and subcontract_id = '" +
                contractNo +
                "'";
              var res3 = ObjectStore.queryByYonQL(sql3);
              if (res3[0].id == res2[n].productionWorkNumber && param.data[0].shedSettlementStatementDetailList[m]._status != "Delete") {
                sum1 = sum1 + 1;
              }
            }
          }
          if (sum1 > 1) {
            throw new Error("生产工号" + param.data[0].shedSettlementStatementDetailList[m].productionWorkNumber_productionWorkNumber + "已结算");
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });