let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取全部数据
    let data = param.return;
    // 获取主表id
    let id = param.return.id;
    let shifujisuananquanchubeijin = param.return.shifujisuananquanchubeijin;
    // 字段赋初始值为零
    let amountAdvanced = 0;
    let shedFeeSubtotal = 0;
    let settlementAmount = 0;
    let amountInTotal = 0;
    let totalAdvanceAmount = 0;
    var safeReserve = 0;
    let finalSettlementAmount = 0;
    let otherExpenses = 0;
    let pid = "";
    // 获取子表集合
    //根据id查询子表
    var sql1 = "select * from GT102917AT3.GT102917AT3.shedSettlementStatementDetail where shedSettlementForm_id = '" + id + "'and dr = 0";
    var List = ObjectStore.queryByYonQL(sql1);
    if (List.length != 0) {
      for (var i = 0; i < List.length; i++) {
        // 计算合计金额
        amountInTotal = amountInTotal + List[i].shedFeeSubtotal;
        // 获取总预支金额
        totalAdvanceAmount = totalAdvanceAmount + List[i].amountAdvanced;
        if (shifujisuananquanchubeijin == "Y") {
          // 获取安全储备金
          safeReserve = 0;
        }
      }
      //获取其他金额
      otherExpenses = param.return.otherExpenses;
      // 获取最终结算金额
      finalSettlementAmount = amountInTotal - totalAdvanceAmount - safeReserve - otherExpenses;
      var mainObject = { id: id, amountInTotal: amountInTotal, totalAdvanceAmount: totalAdvanceAmount, safeReserve: safeReserve, finalSettlementAmount: finalSettlementAmount };
      var Mainres = ObjectStore.updateById("GT102917AT3.GT102917AT3.shedSettlementForm", mainObject, "e30c0412");
      // 遍历子表集合
      for (var i = 0; i < List.length; i++) {
        // 计算结算金额
        settlementAmount = List[i].shedFeeSubtotal - List[i].amountAdvanced;
        // 获取子表id
        pid = List[i].id;
        // 更新子表条件
        var object = { id: id, shedSettlementStatementDetailList: [{ id: pid, settlementAmount: settlementAmount, _status: "Update" }] };
        var Sunres = ObjectStore.updateById("GT102917AT3.GT102917AT3.shedSettlementForm", object, "e30c0412");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });