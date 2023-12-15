let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取全部数据
    let data = param.return;
    // 获取主表id
    let id = param.return.id;
    let shifujisuananquanchubeijin = param.return.shifujisuananquanchubeijin;
    // 字段赋初始值为零
    let amountInTotal = 0;
    let amountInTotals = 0;
    let totalAdvanceAmount = 0;
    let amountAdvanced = 0;
    let hoistingFeeSubtotal = 0;
    let settlementAmount = 0;
    let pid = "";
    // 获取子表集合
    //根据id查询子表
    var sql1 = "select * from GT102917AT3.GT102917AT3.detailsOfLiftingStatement where liftTheBalanceSheet_id = '" + id + "'and dr = 0";
    var List = ObjectStore.queryByYonQL(sql1);
    if (List.length != 0) {
      for (var i = 0; i < List.length; i++) {
        // 计算出合计金额
        amountInTotal = amountInTotal + List[i].hoistingFeeSubtotal - List[i].amountAdvanced;
        // 计算出合计金额
        amountInTotals = amountInTotals + List[i].hoistingFeeSubtotal;
        // 计算出总预支金额
        totalAdvanceAmount = totalAdvanceAmount + List[i].amountAdvanced;
      }
      if (shifujisuananquanchubeijin == "Y") {
        // 计算出安全储备金
        var safeReserve = 0;
      }
      // 获取页面上的其他金额
      let otherExpenses = param.return.otherExpenses;
      // 计算出最终结算金额
      let finalSettlementAmount = amountInTotal - safeReserve - otherExpenses;
      // 更新主表条件
      var updateWrapper = new Wrapper();
      updateWrapper.eq("id", id);
      // 待更新字段内容
      var toUpdate = { amountInTotal: amountInTotal, totalAdvanceAmount: totalAdvanceAmount, safeReserve: safeReserve, finalSettlementAmount: finalSettlementAmount };
      // 执行更新
      var res = ObjectStore.update("GT102917AT3.GT102917AT3.liftTheBalanceSheet", toUpdate, updateWrapper, "57a5a52d");
      // 遍历子表集合
      for (var i = 0; i < List.length; i++) {
        // 计算出结算金额
        settlementAmount = List[i].hoistingFeeSubtotal - List[i].amountAdvanced;
        // 获取子表id
        pid = List[i].id;
        // 更新子表条件
        var updateWrapper1 = new Wrapper();
        updateWrapper1.eq("id", pid);
        // 待更新字段内容
        var toUpdate1 = { settlementAmount: settlementAmount };
        // 执行更新
        var res1 = ObjectStore.update("GT102917AT3.GT102917AT3.detailsOfLiftingStatement", toUpdate1, updateWrapper1, "5f546a23");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });