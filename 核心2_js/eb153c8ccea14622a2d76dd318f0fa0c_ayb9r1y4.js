let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.return;
    // 获取id
    let id = param.return.id;
    // 字段赋初始化为零
    let amountInTotal = 0;
    let amountAdvanced = 0;
    let settlementAmount = 0;
    let pid = null;
    // 找到子表集合
    // 字段赋初始化为零
    let totalAmount = 0;
    let totalAmountOfAdvance = 0;
    let safeReserve = 0;
    let qualityGuaranteeDeposit = 0;
    let otherExpenses = 0;
    let finalSettlementAmount = 0;
    var installBillingDetailsList = data.hasOwnProperty("installBillingDetailsList");
    if (installBillingDetailsList) {
      let List = data.installBillingDetailsList;
      // 遍历子表集合
      for (var i = 0; i < List.length; i++) {
        // 获取总合计金额
        totalAmount = totalAmount + List[i].amountInTotal;
        // 获取总预支金额
        totalAmountOfAdvance = totalAmountOfAdvance + List[i].amountAdvanced;
        // 获取安全储备金
        safeReserve = safeReserve + totalAmount * 0.1;
        // 获取质保金
        qualityGuaranteeDeposit = List.length * 200;
        // 获取最终结算金额
        finalSettlementAmount = totalAmount - totalAmountOfAdvance - safeReserve - otherExpenses - qualityGuaranteeDeposit;
      }
      //更新主表条件
      var updateWrapper = new Wrapper();
      updateWrapper.eq("id", id);
      // 待更新字段内容
      var toUpdate = {
        totalAmount: totalAmount,
        totalAmountOfAdvance: totalAmountOfAdvance,
        safeReserve: safeReserve,
        qualityGuaranteeDeposit: qualityGuaranteeDeposit,
        finalSettlementAmount: finalSettlementAmount
      };
      // 执行更新
      var res = ObjectStore.update("GT102917AT3.GT102917AT3.installationStatement", toUpdate, updateWrapper, "3d2106ad");
      // 遍历子表集合
      for (var j = 0; j < List.length; j++) {
        // 获取结算金额
        settlementAmount = List[j].amountInTotal - List[j].amountAdvanced;
        // 获取子表id
        pid = List[j].id;
        // 更新子表条件
        var updateWrapper1 = new Wrapper();
        updateWrapper1.eq("id", pid);
        // 待更新字段内容
        var toUpdate1 = { settlementAmount: settlementAmount };
        // 执行更新
        var res1 = ObjectStore.update("GT102917AT3.GT102917AT3.installBillingDetails", toUpdate1, updateWrapper1, "3d2106ad");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });