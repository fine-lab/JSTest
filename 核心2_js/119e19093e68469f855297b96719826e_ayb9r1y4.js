let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.return;
    // 获取id
    let id = param.return.id;
    let shifujisuanzhibaojin = param.return.shifujisuanzhibaojin;
    let shifujisuananquanchubeijin = param.return.shifujisuananquanchubeijin;
    // 字段赋初始化为零
    let amountInTotal = 0;
    let amountAdvanced = 0;
    let settlementAmount = 0;
    let pid = null;
    // 找到子表集合
    // 字段赋初始化为零
    let totalAmount = 0;
    let totalAmountOfAdvance = 0;
    var safeReserve = 0;
    var qualityGuaranteeDeposit = 0;
    let otherExpenses = 0;
    let finalSettlementAmount = 0;
    //根据id查询安装结算子表
    var sql1 = "select * from GT102917AT3.GT102917AT3.installBillingDetails where installationStatement_id = '" + id + "'and dr = 0";
    var List = ObjectStore.queryByYonQL(sql1);
    if (List.length != 0) {
      // 遍历子表集合
      for (var i = 0; i < List.length; i++) {
        // 获取总合计金额
        totalAmount = totalAmount + List[i].amountInTotal;
        // 获取总预支金额
        totalAmountOfAdvance = totalAmountOfAdvance + List[i].amountAdvanced;
        if (shifujisuananquanchubeijin == "Y") {
          // 获取安全储备金               qualityGuaranteeDeposit  safeReserve
        }
        if (shifujisuanzhibaojin == "Y") {
          // 获取质保金
        }
        // 获取最终结算金额
        finalSettlementAmount = totalAmount - totalAmountOfAdvance - safeReserve - otherExpenses - qualityGuaranteeDeposit;
      }
      //更新主表条件
      var mainObject = {
        id: id,
        totalAmount: totalAmount,
        totalAmountOfAdvance: totalAmountOfAdvance,
        safeReserve: safeReserve,
        qualityGuaranteeDeposit: qualityGuaranteeDeposit,
        finalSettlementAmount: finalSettlementAmount
      };
      var Mainres = ObjectStore.updateById("GT102917AT3.GT102917AT3.installationStatement", mainObject, "3d2106ad");
      // 遍历子表集合
      for (var j = 0; j < List.length; j++) {
        // 获取结算金额
        settlementAmount = List[j].amountInTotal - List[j].amountAdvanced;
        // 获取子表id
        pid = List[j].id;
        // 更新子表条件
        var sunObject = { id: id, installBillingDetailsList: [{ id: pid, settlementAmount: settlementAmount, _status: "Update" }] };
        var Sunres = ObjectStore.updateById("GT102917AT3.GT102917AT3.installationStatement", sunObject, "3d2106ad");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });