let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var sum = 0;
    var data = param.data[0];
    //获取所有子表信息
    // 判断子表是否存在
    var flag = data.hasOwnProperty("changeDetailsDetailsList");
    if (flag) {
      var ids = "";
      var list = param.data[0].changeDetailsDetailsList;
      for (var i = 0; i < list.length; i++) {
        var flag2 = list[i].hasOwnProperty("productionWorkNumber");
        if (flag2) {
          //获取分包合同子表id
          let id = list[i].productionWorkNumber;
          //查询所有生产工号id为id的变更明细情况详情的变更金额并累加                                                             GT102917AT3.GT102917AT3.subcontractDetails
          var sql =
            "select changeAmount,productionWorkNumber.additionalAmount,productionWorkNumber.theTotalPackageCombined,productionWorkNumber.subcontract_id from GT102917AT3.GT102917AT3.changeDetailsDetails where productionWorkNumber='" +
            id +
            "'";
          var res = ObjectStore.queryByYonQL(sql);
          //获取本条单据变更金额,并赋给sum
          sum = 0; //list[i].changeAmount;
          for (var j = 0; j < res.length; j++) {
            if (res[j].changeAmount != null) {
              sum = sum + res[j].changeAmount;
            }
          }
          //获取分包合同子表附加合计金额
          if (res[0].productionWorkNumber_additionalAmount != null) {
            var additionalAmount = res[0].productionWorkNumber_additionalAmount;
          } else {
            var additionalAmount = 0;
          }
          //获取总包合计
          if (res[0].productionWorkNumber_theTotalPackageCombined != null) {
            var theTotalPackageCombined = res[0].productionWorkNumber_theTotalPackageCombined;
          } else {
            var theTotalPackageCombined = 0;
          }
          //获取分包合同主表id
          ids = res[0].productionWorkNumber_subcontract_id;
          //计算合计金额
          var amountOfJobNo = additionalAmount + theTotalPackageCombined + sum;
          // 更新条件
          var updateWrapper = new Wrapper();
          updateWrapper.eq("id", id);
          // 待更新字段内容
          var toUpdate = { amountOfChange: sum, amountOfJobNo: amountOfJobNo };
          var res1 = ObjectStore.update("GT102917AT3.GT102917AT3.subcontractDetails", toUpdate, updateWrapper, "82884516");
        }
      }
      //查询分包合同子表
      let sqlSon = "select * from GT102917AT3.GT102917AT3.subcontractDetails where subcontract_id=" + ids + "";
      let resSon = ObjectStore.queryByYonQL(sqlSon);
      var Sum = 0;
      if (resSon.length > 0) {
        //计算合计金额
        for (var j = 0; j < resSon.length; j++) {
          if (resSon[j].amountOfJobNo != null) {
            Sum = Sum + resSon[j].amountOfJobNo;
          }
        }
      }
      //更新分包合同
      var objects = { id: ids, totalAmountOfTheContract: Sum };
      var updateRess = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontract", objects, "5ff76a5f");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });