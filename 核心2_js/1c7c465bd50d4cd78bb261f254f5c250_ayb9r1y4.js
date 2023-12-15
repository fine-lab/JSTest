let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let Data = param.data;
    var num = 0;
    if (Data.length > 0) {
      for (let i = 0; i < Data.length; i++) {
        // 主表id
        let Mainid = Data[i].id;
        let sum = 0;
        // 查询分包详情
        let sql = "select * from GT102917AT3.GT102917AT3.subcontractDetails where subcontract_id = '" + Mainid + "'";
        var res = ObjectStore.queryByYonQL(sql);
        if (res.length > 0) {
          for (let j = 0; j < res.length; j++) {
            // 子表id
            let Sunid = res[j].id;
            var mountingCost = 0;
            var hoistCost = 0;
            var boothsFee = 0;
            var five_WayCallCharges = 0;
            var utilities = 0;
            var cooperateWithTheFee = 0;
            var projectExpense = 0;
            var inspectionFee = 0;
            var craftSubsidy = 0;
            var taxAmount = 0;
            var rest = 0;
            // 附加合计金额
            let additionalAmount = 0;
            // 变更合计金额
            let amountOfChange = 0;
            // 判断是否存在
            if (res[j].hasOwnProperty("mountingCost")) {
              mountingCost = res[j].mountingCost;
            }
            if (res[j].hasOwnProperty("hoistCost")) {
              hoistCost = res[j].hoistCost;
            }
            if (res[j].hasOwnProperty("boothsFee")) {
              boothsFee = res[j].boothsFee;
            }
            if (res[j].hasOwnProperty("five_WayCallCharges")) {
              five_WayCallCharges = res[j].five_WayCallCharges;
            }
            if (res[j].hasOwnProperty("utilities")) {
              utilities = res[j].utilities;
            }
            if (res[j].hasOwnProperty("cooperateWithTheFee")) {
              cooperateWithTheFee = res[j].cooperateWithTheFee;
            }
            if (res[j].hasOwnProperty("projectExpense")) {
              projectExpense = res[j].projectExpense;
            }
            if (res[j].hasOwnProperty("inspectionFee")) {
              inspectionFee = res[j].inspectionFee;
            }
            if (res[j].hasOwnProperty("craftSubsidy")) {
              craftSubsidy = res[j].craftSubsidy;
            }
            if (res[j].hasOwnProperty("taxAmount")) {
              taxAmount = res[j].taxAmount;
            }
            if (res[j].hasOwnProperty("rest")) {
              rest = res[j].rest;
            }
            if (res[j].hasOwnProperty("additionalAmount")) {
              // 附加合计金额
              additionalAmount = res[j].additionalAmount;
            }
            if (res[j].hasOwnProperty("amountOfChange")) {
              // 变更合计金额
              amountOfChange = res[j].amountOfChange;
            }
            // 合计
            var theTotalPackageCombined =
              mountingCost + hoistCost + boothsFee + five_WayCallCharges + utilities + cooperateWithTheFee + projectExpense + inspectionFee + craftSubsidy + taxAmount + rest;
            // 合计金额
            var amountOfJobNo = theTotalPackageCombined + additionalAmount + amountOfChange;
            sum = sum + amountOfJobNo;
            // 更新表体金额
            var object = { id: Mainid, subcontractDetailsList: [{ id: Sunid, theTotalPackageCombined: theTotalPackageCombined, amountOfJobNo: amountOfJobNo, _status: "Update" }] };
            var Res = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontract", object, "5ff76a5f");
            num = num + theTotalPackageCombined;
            //更新表头金额
            if (j == res.length - 1) {
              var object1 = { id: Mainid, totalAmountOfTheContract: num, _status: "Update" };
              var res1 = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontract", object1, "5ff76a5f");
            }
          }
        }
      }
    } else {
      throw new Error("未查询到新增数据，请填写数据");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });