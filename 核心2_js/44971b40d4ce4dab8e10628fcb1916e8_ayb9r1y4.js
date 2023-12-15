let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    var id = "";
    if (data.hasOwnProperty("additionalConditionDetailsList")) {
      let additionalConditionDetailsList = data.additionalConditionDetailsList;
      var amountOfChange = 0;
      for (var i = 0; i < additionalConditionDetailsList.length; i++) {
        var additionAmount = 0;
        var theTotalPackageCombined = 0;
        // 获取生产工号
        let productionWorkNumber = additionalConditionDetailsList[i].productionWorkNumber;
        let sql = "select * from GT102917AT3.GT102917AT3.subcontractDetails where id='" + productionWorkNumber + "' and dr = 0";
        let res = ObjectStore.queryByYonQL(sql, "developplatform");
        if (res.length > 0) {
          //获取分包合同id
          id = res[0].subcontract_id;
          if (res[0].amountOfChange != null) {
            var amountOfChange = res[0].amountOfChange;
          }
          if (res[0].theTotalPackageCombined != null) {
            //获取总包合计
            var theTotalPackageCombined = res[0].theTotalPackageCombined;
          }
          //查询附加合同
          let sql1 = "select * from GT102917AT3.GT102917AT3.additionalConditionDetails where productionWorkNumber ='" + productionWorkNumber + "' and dr=0";
          let res1 = ObjectStore.queryByYonQL(sql1, "developplatform");
          for (var j = 0; j < res1.length; j++) {
            if (res1[j].additionAmount != null) {
              additionAmount = additionAmount + res1[j].additionAmount;
            }
          }
          var resAdd = 0;
          // 判断是否存在
          if (res[0].hasOwnProperty("additionalAmount")) {
            resAdd = res[0].additionalAmount;
          }
          // 进行赋值
          let price = additionAmount;
          //获取变更合计
          //计算合计金额
          var amountOfJobNo = amountOfChange + theTotalPackageCombined + price;
          var object = { id: productionWorkNumber, additionalAmount: price, amountOfJobNo: amountOfJobNo };
          var updateRes = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontractDetails", object, "82884516");
        }
      }
      //查询分包合同子表
      let sqlSon = "select * from GT102917AT3.GT102917AT3.subcontractDetails where subcontract_id=" + id + "";
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
      var objects = { id: id, totalAmountOfTheContract: Sum };
      var updateRess = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontract", objects, "5ff76a5f");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });